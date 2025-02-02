import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incidents } from './entity/incidents.entity';
import { PwnedService } from '../common/providers/pwned.service';
import { UserOtp } from './entity/user-otp.entity';
import { Users } from './entity/users.entity';
import { IncidentService } from './incident.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CookieService } from '../common/providers/cookie.service';
import { TokenService } from '../common/providers/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Users, UserOtp, Incidents])],
  controllers: [UsersController],
  providers: [
    UsersService,
    PwnedService,
    IncidentService,
    CookieService,
    TokenService,
    JwtService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
