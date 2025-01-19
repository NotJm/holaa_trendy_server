import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWT_AGE } from 'src/common/constants/contants';
import { CookieService } from 'src/common/providers/cookie.service';
import { EmailService } from 'src/common/providers/email.service';
import { Users } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { OtpService } from '../common/providers/otp.service';
import { PwnedService } from '../common/providers/pwned.service';
import { TokenService } from '../common/providers/token.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { MFAService } from '../mfa/mfa.service';
import { Incidents } from '../users/entity/incidents.entity';
import { UserOtp } from '../users/entity/user-otp.entity';
import { IncidentService } from '../users/incident.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountActivationService } from './providers/account-activation.service';
import { Argon2Service } from './providers/argon2.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Users, UserOtp, Incidents]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: JWT_AGE },
      }),
      inject: [ConfigService],
    }),
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
    Argon2Service,
    AccountActivationService,
    MFAService,
    OtpService,
    IncidentService
  ],
  exports: [AuthService],
})
export class AuthModule {}
