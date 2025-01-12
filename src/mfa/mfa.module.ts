import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IncidentService } from '../admin/incident/incident.service';
import { CookieService } from '../common/providers/cookie.service';
import { EmailService } from '../common/providers/email.service';
import { PwnedService } from '../common/providers/pwned.service';
import { OtpService } from '../users/otp.service';
import { UsersService } from '../users/users.service';
import { MFAController } from './mfa.controller';
import { MFAService } from './mfa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOtp } from '../users/entity/user-otp.entity';
import { Users } from '../users/entity/users.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Users, UserOtp])
  ],
  controllers: [MFAController],
  providers: [
    MFAService,
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
