import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';

@Module({
  imports: [],
  controllers: [IncidentController],
  providers: [IncidentService, JwtService],
  exports: [IncidentService],
})
export class IncidentModule {}
