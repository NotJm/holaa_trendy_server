import { Injectable } from "@nestjs/common";
import * as argon2 from 'argon2';

@Injectable()
export class Argon2Service {
    /**
     * Metodo que ocupa argon2 para hashear una contraseña
     * @param password Dato a encriptar
     * @returns Regresa la cadena encriptada
     */
    async hash(password: string): Promise<string> {
        try {
            return await argon2.hash(password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,
                timeCost: 3,
                parallelism: 1
            });
        } catch (err) {
            throw err;
        }
    }

    async compare(hash: string, password: string): Promise<boolean> {
        try {
            return await argon2.verify(hash, password);
        } catch (err) {
            throw err;
        }
    }
} 