import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { Global, Module } from '@nestjs/common';
import { User, UserSchema } from './schemas/user.schema';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from '../core/services/email.service';
import { PwnedService } from '../core/services/pwned.service';
import { ZxcvbnService } from '../core/services/zxcvbn.service';
import { HttpModule } from '@nestjs/axios';
import { OtpService } from '../core/services/otp.service';
import { LogService } from '../core/services/log.service';
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
    LogService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
