import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        const users = await this.usersService.find(email);
        if (users.length) {
            throw new BadRequestException('email in use');
        }

        // 1byte 당 2글자이기 때문에 총 16자 랜덤 salt가 만들어짐
        const salt = randomBytes(8).toString('hex'); // 랜덤으로 0101로 뽑아서 16진수로 바꾸어줌

        // 해시 만들기 (세번 째는 scrypt의 길이임)
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // salt와 hash 합쳐주기
        const result = salt + '.' + hash.toString('hex'); // buffer를 문자열로 합쳐주는 것은 어렵기 때문에 hex로 바꾸어줌 (가능하긴 함)

        const user = await this.usersService.create(email, result);

        return user;
    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);

        if (!user) {
            throw new NotFoundException('not found user');
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash === hash.toString('hex')) {
            return user;
        } else {
            throw new BadRequestException('bad password');
        }
    }

}