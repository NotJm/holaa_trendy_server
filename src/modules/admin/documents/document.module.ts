import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './document.controller';
import { RegulatoryDocumentService as DocumentService } from './document.service';
import { RegulatoryDocument } from './entity/regulatory-document.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([RegulatoryDocument])
  ],
  controllers: [DocumentController],
  providers: [DocumentService, JwtService],
  exports: [DocumentService],
})
export class DocumentModule {}
