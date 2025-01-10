import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IncidentService } from '../admin/incident/incident.service';
import { PwnedService } from '../common/providers/pwned.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';


@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Users])
  ],
  controllers: [UsersController],
  providers: [UsersService, PwnedService, IncidentService],
  exports: [UsersService],
})
export class UsersModule {}
