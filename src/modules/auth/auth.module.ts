import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from '../../common/config/jwt.config';
import { TwilioService } from '../../common/microservice/twilio.service';
import { CookieService } from '../../common/providers/cookie.service';
import { EmailService } from '../../common/providers/email.service';
import { HbsService } from '../../common/providers/hbs.service';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { Address } from '../users/entity/user-address.entity';
import { Incident } from '../users/entity/user-incident.entity';
import { User } from '../users/entity/users.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountActivationService } from './providers/account-activation.service';
import { RefreshTokenService } from './providers/refresh-token.service';
import { SessionService } from './providers/session.service';
import { TokenService } from './providers/token.service';
import { VerificationService } from './providers/verification.service';

@Module({
  imports: [
    UsersModule,
    HttpModule,
    TypeOrmModule.forFeature([User, Incident, Address, RefreshTokenService]),
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
    EmailService,
    TokenService,
    RefreshTokenService,
    CookieService,
    AccountActivationService,
    HbsService,
    TwilioService,
    SessionService,
    VerificationService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
