import { Injectable, BadRequestException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSocialSiteDto } from './dto/create.social.dto';
import { SocialSite, SocialSiteDocument } from './schemas/social.sites.schema';
import { updateSocialSiteDto } from './dto/update.social.dto';


@Injectable()
export class SocialService {
  constructor(
    @InjectModel(SocialSite.name)
    private readonly socialModel: Model<SocialSiteDocument>,
  ) {}

  // Metodo para la creacion de un "social site"
  async create(createSocialSiteDto: CreateSocialSiteDto) {
    const { name, icon, url, description } = createSocialSiteDto;

    const social = new this.socialModel({
      name: name,
      icon: icon,
      url: url,
      description: description
    })

    await social.save();

    return {
      status: HttpStatus.OK,
      message: "Se a creado la red social con exito!"
    }
    
  }


  // Metodo para la actualizacion de un "social site"
  async update(id: string, updateSocialSiteDto: updateSocialSiteDto): Promise<SocialSiteDocument> {
    const social = await this.socialModel.findById(id).exec();

    if (!social) {
      throw new NotFoundException({
        message: `Red social con ID: ${id} no encontrado`
      })
    }

    const update_social = new this.socialModel({
      ...social.toObject(),
      ...updateSocialSiteDto
    })

    return await update_social.save();
  }

  // Metodo para eliminar social site
  async delete(id: string): Promise<any> {
    const social = await this.socialModel.findById(id);

    if (!social) {
      throw new NotFoundException({
        message: `Red social con ID: ${id} no encontrado`,
      })
    }

    await this.socialModel.deleteOne({ id })

    return {
      status: HttpStatus.OK,
      message: "La red social a sido eliminada exitosamente"
    }

  }

  // Método para manejar el URL de la imagen subida desde el widget de Cloudinary
  async uploadImage(imageUrl: string) {
    if (!imageUrl) {
      throw new BadRequestException('La URL de la imagen es obligatoria');
    }

    // Verificación básica del URL de la imagen (opcional)
    const isValidImage = this.isValidImageUrl(imageUrl);
    if (!isValidImage) {
      throw new BadRequestException('Formato de imagen no válido');
    }

    // Guardar la URL de la imagen (en una base de datos, por ejemplo)
    const savedImage = await this.saveImageUrl(imageUrl);

    return {
      message: 'Imagen subida con éxito',
      url: savedImage,
    };
  }

  // Método privado para validar la URL de la imagen
  private isValidImageUrl(imageUrl: string): boolean {
    // Simple validación del formato de la imagen por extensión
    return /\.(jpg|jpeg|png|gif)$/.test(imageUrl);
  }

  // Método privado para simular el almacenamiento de la URL
  private async saveImageUrl(imageUrl: string): Promise<string> {
    // Simulación de guardado de URL (esto puedes reemplazarlo con tu lógica de base de datos)
    return new Promise((resolve) => {
      setTimeout(() => resolve(imageUrl), 1000); // Aquí iría tu lógica real de guardado
    });
  }
}
