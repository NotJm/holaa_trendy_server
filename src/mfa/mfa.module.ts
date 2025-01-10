import { MFAController } from './mfa.controller';
import { Module } from '@nestjs/common';
import { MFAService } from './mfa.service';
import { OtpService } from '../common/providers/otp.service';
import { EmailService } from '../common/providers/email.service';
import { CookieService } from '../common/providers/cookie.service';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { PwnedService } from '../common/providers/pwned.service';
import { IncidentService } from '../admin/incident/incident.service';
import { HttpModule } from '@nestjs/axios';
import { Incidents, IncidentsSchema } from '../admin/incident/schemas/incident.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Incidents.name, schema: IncidentsSchema }])
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
