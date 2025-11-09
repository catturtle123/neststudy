import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Report]
        }
      } 
    }),
      //   type: 'sqlite',
      //   database: 'db.sqlite', // db를 뭐로 할지를 결정
      //   entities: [ User, Report ],
      //   synchronize: true,
      // }), 
      UsersModule, 
      ReportsModule
    ],
    controllers: [AppController],
    providers: [
      AppService, 
      {
        provide:APP_PIPE, 
        useValue: new ValidationPipe({
          whitelist: true
        })
      }
    ],
})
export class AppModule {
  constructor(
    private configService: ConfigService
  ) {}

  configure(consumer: MiddlewareConsumer) { // 요청이 들어올 때마다 실행될 미들웨어 설정 가능
    consumer.apply(
                  cookieSession({
                keys: [this.configService.get('COOKIE_KEY')]
              }))
      .forRoutes('*');
  }
}