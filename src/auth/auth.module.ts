import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { User, UserSchema } from './schemas/user.schema';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PwnedService } from '../core/services/pwned.service';
import { ZxcvbnService } from '../core/services/zxcvbn.service';
import { HttpModule } from '@nestjs/axios';
import { OtpService } from '../core/services/otp.service';
import { LogService } from '../core/services/log.service';
import { IncidentModule } from '../admin/incident/incident.module';
import { EmailModule } from 'src/admin/email/email.module';
import { EmailService } from 'src/admin/email/email.service';
import { EmailConfiguration, EmailConfigurationSchema } from 'src/admin/email/schemas/email.config.schema';

@Module({
  imports: [
    HttpModule,
    EmailModule,
    MongooseModule.forFeature([{ name: EmailConfiguration.name, schema: EmailConfigurationSchema }]),
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
    PwnedService,
    EmailService,
    ZxcvbnService,
    OtpService,
    LogService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
