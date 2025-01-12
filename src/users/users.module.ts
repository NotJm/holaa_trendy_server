import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentService } from '../admin/incident/incident.service';
import { PwnedService } from '../common/providers/pwned.service';
import { UserOtp } from './entity/user-otp.entity';
import { Users } from './entity/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';


@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Users, UserOtp])
  ],
  controllers: [UsersController],
  providers: [UsersService, PwnedService, IncidentService],
  exports: [UsersService],
})
export class UsersModule {}
