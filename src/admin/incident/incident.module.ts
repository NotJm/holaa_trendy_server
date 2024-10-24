import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Incident, IncidentSchema } from './schemas/incident.schema';
import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';
import { JwtService } from '@nestjs/jwt';
import { Config, ConfigSchema } from './schemas/config.schemas';
import { EmailMessage, EmailMessageSchema } from './schemas/emai.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Incident.name, schema: IncidentSchema }]),
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
    MongooseModule.forFeature([{ name: EmailMessage.name, schema: EmailMessageSchema }]),
  ],
  controllers: [IncidentController],
  providers: [IncidentService, JwtService],
  exports: [IncidentService]
})
export class IncidentModule {}  
