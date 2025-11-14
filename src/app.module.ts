import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TYPEORM_CONFIG } from './config/typeorm.config';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
      TypeOrmModule.forRoot(TYPEORM_CONFIG[process.env.NODE_ENV || 'development']),
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