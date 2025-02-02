import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incidents } from '../users/entity/incidents.entity';
import { CookieService } from '../common/providers/cookie.service';
import { EmailService } from '../common/providers/email.service';
import { PwnedService } from '../common/providers/pwned.service';
import { UserOtp } from '../users/entity/user-otp.entity';
import { Users } from '../users/entity/users.entity';
import { IncidentService } from '../users/incident.service';
import { OtpService } from '../common/providers/otp.service';
import { UsersService } from '../users/users.service';
import { MFAController } from './mfa.controller';
import { MFAService } from './mfa.service';
import { TokenService } from '../common/providers/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Users, UserOtp, Incidents])
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
  ],
  exports: [MFAService],
})
export class MFAModule {}
