import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { User, UserSchema } from './schemas/user.schema';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './service/email.service';
import { PwnedService } from '../auth/service/pwned.service';
import { ZxcvbnService } from '../auth/service/zxcvbn.service';
import { HttpModule } from '@nestjs/axios';
import { OtpService } from '../auth/service/otp.service';
import { LogService } from '../common/services/log.service';
import { IncidentModule } from '../admin/incident/incident.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '15m' }, 
      }),
      inject: [ConfigService],
    }),
    IncidentModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    PwnedService,
    ZxcvbnService,
    OtpService,
    LogService
  ],
  exports: [AuthService],
})
export class AuthModule {}
