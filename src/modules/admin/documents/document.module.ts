import { MongooseModule } from '@nestjs/mongoose';
import { DocumentController } from './document.controller';
import { DrService as DocumentService } from './document.service';
import { Module } from '@nestjs/common';
import { DocumentRegulatory, DrSchema } from './schemas/document.schema';
import { JwtService } from '@nestjs/jwt';
import { AuditModule } from '../audit/audit.module';


@Module({
  imports: [
    AuditModule,
    MongooseModule.forFeature([
        {
            name: DocumentRegulatory.name,
            schema: DrSchema
        }
    ])
  ],
  controllers: [DocumentController],
  providers: [DocumentService, JwtService],
  exports: [DocumentService],
})
export class DocumentModule {}
