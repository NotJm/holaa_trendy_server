import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpInfoService } from '../../common/microservice/ipinfo.service';
import { PwnedService } from '../../common/microservice/pwned.service';
import { Argon2Service } from '../../common/providers/argon2.service';
import { Address } from './entity/user-address.entity';
import { Incident } from './entity/user-incident.entity';
import { User } from './entity/users.entity';
import { IncidentService } from './incident.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, Incident, Address]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    PwnedService,
    IncidentService,
    IpInfoService,
    JwtService,
    Argon2Service,
  ],
  exports: [UsersService],
})
export class UsersModule {}
