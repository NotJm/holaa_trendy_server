import { DatabaseModule } from './database/database.module';
import { MFAModule } from './mfa/mfa.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditModule } from './admin/audit/audit.module';
import { BusinessModule } from './admin/business/business.module';
import { DocumentModule } from './admin/documents/document.module';
import { PolicyModule } from './admin/politicas/policy.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { AllHttpExceptionsFilter } from './exceptions/http.exception.filter';
import { CorsMiddleware } from './middleware/cors.middleware';
import { ProductModule } from './products/product.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // MFAModule,
    // CategoryModule,
    // ProductModule,
    // AuditModule,
    // BusinessModule,
    // PolicyModule,
    // AuthModule,
    UsersModule,
    // DocumentModule,
    // MFAModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: true,
        logging: true
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllHttpExceptionsFilter,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
