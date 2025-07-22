import { Module } from '@nestjs/common';
import { cloudinaryConfig } from 'src/common/config/cloudinary.config';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [],
  providers: [cloudinaryConfig, CloudinaryService],
  exports: [CloudinaryService, 'CLOUDINARY'],
})
export class CloudinaryModule {}
