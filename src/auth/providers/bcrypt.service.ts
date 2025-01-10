import { Injectable } from "@nestjs/common";
import { hash, genSalt, compare } from "bcrypt";


@Injectable()
export class BcryptService {
    /**
     * Metodo para poder encriptar una cadena de texto
     * @param data Dato a encriptar
     * @returns Regresa la cadena encriptada
     */
    async hash(data: string): Promise<string> {
        const salt = await genSalt();
        return hash(data, salt);
    }

    async compare(data: string, encrypted: string): Promise<boolean> {
        return compare(data, encrypted);
    }
} 