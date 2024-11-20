import { IsEmail, IsNotEmpty, IsOptional, Matches, MinLength } from 'class-validator';

/**
 * Implementacion de esta estructura para el Request se encarga de verificar datos para el registro
 */
export class RegisterDto {
  @IsOptional()
  readonly sessionId: string = '';

  @IsNotEmpty({ message: "Se requiere nombre de usuario" })
  @MinLength(5, {
    message: 'El nombre de usuario debe tener al menos 5 caracteres',
  })
  @Matches(/^[a-zA-Z0-9_]{5,}$/, {
    message:
      "El nombre de usuario solo puede contener minusculas, mayusculas y numeros y '_' como espacios",
  })
  readonly username: string;

  @IsNotEmpty({ message: 'Por favor, ingrese su contraseña' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 6 caracteres' })
  readonly password: string;

  @IsNotEmpty({ message: "Se requiere un correo electronico"})
  @IsEmail({}, { message: 'Por favor, ingrese un correo valido' })
  readonly email: string;

  @IsOptional()
  readonly emailIsVerify: boolean = false; 
}
