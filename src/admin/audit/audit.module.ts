import { AuditController } from './audit.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditService } from './audit.service';
import { Module } from '@nestjs/common';
import { Audit, AuditSchema } from './schemas/audit.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Audit.name,
        schema: AuditSchema,
      },
    ]),
  ],
  controllers: [AuditController],
  providers: [AuditService, JwtService],
  exports: [AuditService]
})
export class AuditModule {}
