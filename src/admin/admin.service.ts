import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class AdminService {

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
