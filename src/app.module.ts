import { EmailModule } from './admin/email/email.module';
import { AuditModule } from './admin/audit/audit.module';
import { BusinessModule } from './admin/business/business.module';
import { LogService } from './core/services/log.service';
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
import { UsersModule } from './admin/users/users.module';
import { DocumentModule } from './admin/documents/document.module';

@Module({
  imports: [
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
  providers: [LogService, AppService],
  exports: [LogService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
