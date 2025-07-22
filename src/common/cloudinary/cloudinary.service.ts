import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloduinaryResponse } from '../interfaces/cloudinary.response.interface';
import { LoggerApp } from '../logger/logger.service';

@Injectable()
export class CloudinaryService {
  constructor(private readonly loggerApp: LoggerApp) {}

  async uploadImage(url: string, folder: string): Promise<CloduinaryResponse> {
    return cloudinary.uploader.upload(url, { folder: folder });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  async deleteFolder(folder: string): Promise<void> {
    try {
      return await cloudinary.api.delete_resources_by_prefix(folder);
    } catch (error) {
      this.loggerApp.error(
        `Ocurrio un error eliminando los recursos de la carpeta ${folder}`,
      );
    }
  }

  getImageUrl(publicId: string): string {
    return cloudinary.url(publicId);
  }
}
