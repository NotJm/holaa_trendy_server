import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PwnedService {
  private readonly API_PWNED: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.API_PWNED = this.configService.get<string>('API_PWNED');
  }

  /**
   * Metodo principal para saber si una contraseña esta comprometida
   * @param password Contraseña en cuestion
   * @returns True si la contraseña fue comprometida en caso contrario falso
   */
  async isPwned(password: string): Promise<boolean> {
    const timeComitteds = await this.verify(password); 
    return timeComitteds > 0 ;
  }

  /**
   * Permite obtener el numero de veces que fue comprometida la contraseña
   * @param target Contraseña del usuario
   * @returns Numero de veces comprometida
   */
  private async verify(target: string): Promise<number> {
    const hash = this.sha1(target);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5).toUpperCase();

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.API_PWNED}/${prefix}`),
      );
      const hashes = response.data.split('\n');

      for (const line of hashes) {
        const [hashSuffix, count] = line.split(':');
        if (hashSuffix === suffix) {
          return parseInt(count, 10); 
        }
      }
    } catch (err) {
      throw new InternalServerErrorException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error al momento de verificar contraseña`,
      });
    }
  }

  /**
   * Regresa una cadena de texto en formato hexadecimal mayusculas
   * @param target Objetivo a modificar y convertir 
   * @returns hexadecimal mayusculas
   */
  private sha1(target: string): string {
    return crypto.createHash('sha1').update(target).digest('hex').toUpperCase();
  }
}
