import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incidents } from '../users/entity/incidents.entity';
import { UserOtp } from '../users/entity/user-otp.entity';
import { User } from '../users/entity/users.entity';
import { IncidentService } from '../users/incident.service';
import { UsersService } from '../users/users.service';
import { MFAController } from './mfa.controller';
import { MFAService } from './mfa.service';
import { TokenService } from '../../common/providers/token.service';
import { OtpService } from '../../common/providers/otp.service';
import { EmailService } from '../../common/providers/email.service';
import { CookieService } from '../../common/providers/cookie.service';
import { PwnedService } from '../../common/providers/pwned.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, UserOtp, Incidents])
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
