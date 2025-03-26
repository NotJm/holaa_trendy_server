import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieService } from 'src/common/providers/cookie.service';
import { EmailService } from 'src/common/providers/email.service';

import { JwtActivationStrategy } from 'src/common/strategies/jwt.activation.strategy';
import { jwtConfig } from '../../common/config/jwt.config';
import { IpInfoService } from '../../common/microservice/ipinfo.service';
import { PwnedService } from '../../common/microservice/pwned.service';
import { AESService } from '../../common/providers/aes.service';
import { Argon2Service } from '../../common/providers/argon2.service';
import { HbsService } from '../../common/providers/hbs.service';
import { OtpService } from '../../common/providers/otp.service';
import { TokenService } from '../../common/providers/token.service';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { Incident } from '../users/entity/user-incident.entity';
import { UserOtp } from '../users/entity/user-otp.entity';
import { User } from '../users/entity/users.entity';
import { IncidentService } from '../users/incident.service';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshToken } from './entity/refresh-token.entity';
import { AccountActivationService } from './providers/account-activation.service';
import { RefreshTokenService } from './providers/refresh-token.service';
import { SMSVerificationService } from './providers/sms-verification.service';
import { TwilioService } from '../../common/microservice/twilio.service';
import { EmailVerificationService } from './providers/email-verification.service';
import { JwtVerificationStrategy } from 'src/common/strategies/jwt.verfication.strategy';
import { SessionService } from './providers/session.service';
import { RedisService } from '../../common/microservice/redis.service';
import { Address } from '../users/entity/user-address.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, UserOtp, Incident, RefreshToken, Address]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => jwtConfig(configService),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtActivationStrategy,
    JwtVerificationStrategy,
    UsersService,
    PwnedService,
    CookieService,
    EmailService,
    TokenService,
    Argon2Service,
    AESService,
    AccountActivationService,
    SMSVerificationService,
    OtpService,
    IncidentService,
    RefreshTokenService,
    IpInfoService,
    HbsService,
    TwilioService,
    EmailVerificationService,
    SessionService,
    RedisService
  ],
  exports: [AuthService],
})
export class AuthModule {}
