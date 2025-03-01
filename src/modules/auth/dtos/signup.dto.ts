import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  Matches,
  MinLength,
} from 'class-validator';

/**
 * @property {string} username - Nombre de usuario
 * @property {string} password - Contraseña del usuario
 * @property {string} email - Correo del usuario
 */
export class SignUpDto {
  @IsNotEmpty({ message: 'Se requiere nombre de usuario' })
  @MinLength(5, {
    message: 'El nombre de usuario debe tener al menos 5 caracteres',
  })
  @Matches(/^[a-zA-Z0-9_]{5,}$/, {
    message:
      'El nombre de usuario solo puede incluir letras (mayúsculas o minúsculas), números y guiones bajos (_) en lugar de espacios.',
  })
  readonly username: string;

  @IsNotEmpty({ message: 'Se requiere una contraseña' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  readonly password: string;

  @IsNotEmpty({ message: 'Se requiere un correo electronico' })
  @IsEmail({}, { message: 'Por favor, ingrese un correo valido' })
  readonly email: string;

  @IsPhoneNumber('MX', {
    message: 'Se requiere un numero de la region MX(+52)',
  })
  readonly phone: string;
}
