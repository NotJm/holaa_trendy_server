import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieService } from 'src/common/providers/cookie.service';
import { EmailService } from 'src/common/providers/email.service';
import { JWT_AGE } from 'src/constants/contants';
import { Users } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { PwnedService } from '../common/providers/pwned.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { MFAService } from '../mfa/mfa.service';
import { UserOtp } from '../users/entity/user-otp.entity';
import { OtpService } from '../users/otp.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountActivationService } from './providers/account-activation.service';
import { Argon2Service } from './providers/argon2.service';
import { TokenService } from './providers/token.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Users, UserOtp]),
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
    OtpService
  ],
  exports: [AuthService],
})
export class AuthModule {}
