import { IsNotEmpty } from "class-validator";

/**
 * Contiene las credenciales del cliente
 * @property {string} username - Nombre de usuario
 * @property {string} password - Contraseña del usuario
 */
export class LoginDto {
    @IsNotEmpty({ message: "Por favor, ingrese su nombre de usuario" })
    readonly username: string;

    @IsNotEmpty({ message: "Por favor, ingrese su contraseña"})
    readonly password: string;
}