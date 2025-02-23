import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieService } from 'src/common/providers/cookie.service';
import { EmailService } from 'src/common/providers/email.service';

import { jwtConfig } from '../../common/config/jwt.config';
import { OtpService } from '../../common/providers/otp.service';
import { PwnedService } from '../../common/providers/pwned.service';
import { TokenService } from '../../common/providers/token.service';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { MFAService } from '../mfa/mfa.service';
import { Incidents } from '../users/entity/incidents.entity';
import { UserOtp } from '../users/entity/user-otp.entity';
import { User } from '../users/entity/users.entity';
import { IncidentService } from '../users/incident.service';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshToken } from './entity/refresh-token.entity';
import { ActivationService } from './providers/account-activation.service';
import { AESService } from './providers/aes.service';
import { Argon2Service } from './providers/argon2.service';
import { RefreshTokenService } from './providers/refresh-token.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, UserOtp, Incidents, RefreshToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: jwtConfig,
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
    ActivationService,
    MFAService,
    OtpService,
    IncidentService,
    RefreshTokenService,
    AESService
  ],
  exports: [AuthService],
})
export class AuthModule {}
