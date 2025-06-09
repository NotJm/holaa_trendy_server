import { BadRequestException, Controller, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseController } from '../base.controller';
import { IApiResponse } from '../interfaces/api-response.interface';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class CloudinaryController extends BaseController {
  constructor(private readonly cloudinaryService: CloudinaryService) {
    super();
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<IApiResponse> {
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
