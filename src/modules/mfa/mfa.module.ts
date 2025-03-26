import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieService } from '../../common/providers/cookie.service';
import { EmailService } from '../../common/providers/email.service';
import { OtpService } from '../../common/providers/otp.service';
import { PwnedService } from '../../common/providers/pwned.service';
import { TokenService } from '../../common/providers/token.service';
import { Incident } from '../users/entity/user-incident.entity';
import { UserOtp } from '../users/entity/user-otp.entity';
import { User } from '../users/entity/users.entity';
import { IncidentService } from '../users/incident.service';
import { UsersService } from '../users/users.service';
import { MFAController } from './mfa.controller';
import { MFAService } from './mfa.service';
import { IpInfoService } from '../../common/providers/ipinfo.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, UserOtp, Incident])
  ],
  controllers: [MFAController],
  providers: [
    MFAService,
    TokenService,
    JwtService,
    OtpService,
    EmailService,
    UsersService,
    CookieService,
    PwnedService,
    IncidentService,
    IpInfoService,
  ],
  exports: [MFAService],
})
export class MFAModule {}
