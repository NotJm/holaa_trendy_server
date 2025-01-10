import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CookieService } from 'src/common/providers/cookie.service';
import { EmailService } from 'src/common/providers/email.service';
import { JWT_AGE } from 'src/constants/contants';
import { UsersService } from 'src/users/users.service';
import { IncidentModule } from '../admin/incident/incident.module';
import { PwnedService } from '../common/providers/pwned.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptService } from './providers/bcrypt.service';
import { TokenService } from './providers/token.service';
import { AccountActivationService } from './providers/account-activation.service';
import { MFAService } from '../mfa/mfa.service';
import { OtpService } from '../common/providers/otp.service';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: JWT_AGE },
      }),
      inject: [ConfigService],
    }),
    IncidentModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    PwnedService,
    CookieService,
    EmailService,
    TokenService,
    BcryptService,
    AccountActivationService,
    MFAService,
    OtpService
  ],
  exports: [AuthService],
})
export class AuthModule {}
