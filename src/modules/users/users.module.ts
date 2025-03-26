import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpInfoService } from '../../common/microservice/ipinfo.service';
import { PwnedService } from '../../common/microservice/pwned.service';
import { CookieService } from '../../common/providers/cookie.service';
import { TokenService } from '../../common/providers/token.service';
import { Incident } from './entity/user-incident.entity';
import { UserOtp } from './entity/user-otp.entity';
import { User } from './entity/users.entity';
import { IncidentService } from './incident.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Argon2Service } from '../../common/providers/argon2.service';
import { RedisService } from '../../common/microservice/redis.service';
import { Address } from './entity/user-address.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([User, UserOtp, Incident, Address])],
  controllers: [UsersController],
  providers: [
    UsersService,
    PwnedService,
    IncidentService,
    CookieService,
    TokenService,
    IpInfoService,
    JwtService,
    Argon2Service,
    RedisService
  ],
  exports: [UsersService],
})
export class UsersModule {}
