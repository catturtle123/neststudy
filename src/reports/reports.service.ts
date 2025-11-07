import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dto/get-estimate-dto';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

    createEstimate(query: GetEstimateDto) {
        return this.repo.createQueryBuilder()
            .select('AVG(prive)', 'price')
            .where('make = :make', { make: query.make })
            .andWhere('model = :model', { model: query.model })
            .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: query.lng })
            .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: query.lat })
            .andWhere('year - :year BETWEEN -3 AND 3', { year: query.year })
            .andWhere('apporved IS TRUE')
            .orderBy('ABS(mileage - :mileage)', 'DESC')
            .setParameters({ mileage: query.mileage})
            .limit(3)
            .getRawOne();
    }
    
    create(user: User, reportDto: CreateReportDto) {
        const report = this.repo.create(reportDto);
        report.user = user;
        return this.repo.save(report)
    }

    async changeApprove(id: string, approved: boolean) {
        const report = await this.repo.findOne({where: {id: parseInt(id)}});
        if (!report) {
            throw new NotFoundException('report not found');
        }

        report.approved = approved;
        return this.repo.save(report);
    }
}
    