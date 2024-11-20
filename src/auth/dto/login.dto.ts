import { IsEmail, IsNotEmpty, IsString } from "class-validator";

/**
 * Implementacion para la estructura para de como se recibira los datos
 * en este caso las credenciales para poder iniciar sesion
 */
export class LoginDto {
    @IsNotEmpty({ message: "Por favor, ingrese su nombre de usuario" })
    @IsString()
    // @IsEmail({}, { message: "Por favor, ingrese un correo electronico valido"})
    username: string;

    @IsNotEmpty({ message: "Por favor, ingrese su contraseña"})
    password: string;
}