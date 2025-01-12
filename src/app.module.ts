import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AllHttpExceptionsFilter } from './exceptions/http.exception.filter';
import { CorsMiddleware } from './middleware/cors.middleware';
import { Address } from './users/entity/user-address.entity';
import { UserOtp } from './users/entity/user-otp.entity';
import { Users } from './users/entity/users.entity';
import { UsersModule } from './users/users.module';
import { RefreshToken } from './auth/schemas/refresh-token.entity';
import { MFAModule } from './mfa/mfa.module';

@Module({
  imports: [
    // MFAModule,
    // CategoryModule,
    // ProductModule,
    // AuditModule,
    // BusinessModule,
    // PolicyModule,
    AuthModule,
    UsersModule,
    // DocumentModule,
    MFAModule,
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
        entities: [Users, Address, UserOtp, RefreshToken],
        synchronize: true,
        logging: true,
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
