import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

/**
 * @property {string} email - Correo del Usuario
 * @property {string} new_password - Nueva contraseña del usuario
 */
export class ResetPasswordDto {
    @IsNotEmpty({ message: 'Se requiere un correo electronico' })
    @IsEmail({}, { message: 'Por favor, proporcione un correo valido'})
    email: string;
  
    @IsNotEmpty({ message: 'Se requiere una contraseña' })
    @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
    newPassword: string;
  }