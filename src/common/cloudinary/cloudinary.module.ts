import { Module } from '@nestjs/common';
import { cloudinaryConfig } from 'src/common/config/cloudinary.config';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [],
  controllers: [CloudinaryController],
  providers: [cloudinaryConfig, CloudinaryService],
  exports: [CloudinaryService, 'CLOUDINARY'],
})
export class CloudinaryModule {}
