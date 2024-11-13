import { Prop } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// Implementacion de DTO para estructurar lso datos, este en especial se ocupara poder
// empezar con el primer paso para olvidar contraseña en este caso se maneja solo
// el correo electronico para poder confirmar le usuario
export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Por favor, proporciona un correo valido' })
  readonly email: string;
}

// Implementacion del Segundo paso, este en especial se ocupa de que cambiar contraseña
// para esto debe de insertar su email y su nueva contraseña
export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  password: string;
}
