import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exceptions/exception.filter';
import { CategoryModule } from './admin/category/category.module';
import { ProductModule } from './products/product.module';
import { EmailModule } from './admin/email/email.module';
import { AuditModule } from './admin/audit/audit.module';
import { BusinessModule } from './admin/business/business.module';
import { AuthModule } from './auth/auth.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CorsMiddleware } from './middleware/cors.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PolicyModule } from './admin/politicas/policy.module';
import { UsersModule } from './users/users.module';
import { DocumentModule } from './admin/documents/document.module';

@Module({
  imports: [
    CategoryModule,
    ProductModule,
    EmailModule,
    AuditModule,
    BusinessModule,
    PolicyModule,
    AuthModule,
    UsersModule,
    DocumentModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('DATABASE'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
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
