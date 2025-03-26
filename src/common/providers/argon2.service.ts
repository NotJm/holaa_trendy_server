import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class Argon2Service {
  /**
   * Metodo que ocupa argon2 para hashear una contraseña
   * @param data Dato a encriptar
   * @returns Regresa la cadena encriptada
   */
  async hash(data: string): Promise<string> {
    try {
      return await argon2.hash(data, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Metodo que compara el hash con la contraseña del usuario
   * @param hash hash del usuario
   * @param data contraseña que se quiere comparar
   * @returns verdadero si coinciden
   */
  async compare(hash: string, data: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, data);
    } catch (err) {
      throw err;
    }
  }
}
