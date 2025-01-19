import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * @property {string} email - Correo del usuario
 */
export class RequestForgotPasswordDto {
  @IsNotEmpty({ message: 'Se requiere un correo electronico' })
  @IsEmail({}, { message: 'Por favor, proporcione un correo valido' })
  readonly email: string;
}


