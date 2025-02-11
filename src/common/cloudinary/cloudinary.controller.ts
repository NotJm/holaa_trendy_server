import { BadRequestException, Controller, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BaseController } from '../base.controller';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from '../interfaces/api.response.interface';

@Controller('upload')
export class CloudinaryController extends BaseController {
  constructor(private readonly cloudinaryService: CloudinaryService) {
    super();
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<ApiResponse> {
    if (!file) {
      throw new BadRequestException('Archivo no subido');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(file, 'products');
      return {
        status: HttpStatus.OK,
        message: 'Imagen subida con exito',
        data: {
          public_id: result.public_id,
          secure_url: result.secure_url
        }
      }
    } catch (error) {
      return this.handleError(error);
    }
  }
}
