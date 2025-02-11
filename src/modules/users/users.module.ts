import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieService } from '../../common/providers/cookie.service';
import { PwnedService } from '../../common/providers/pwned.service';
import { TokenService } from '../../common/providers/token.service';
import { Incidents } from './entity/incidents.entity';
import { UserOtp } from './entity/user-otp.entity';
import { User } from './entity/users.entity';
import { IncidentService } from './incident.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([User, UserOtp, Incidents])],
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
