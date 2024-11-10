import { IsString, IsNotEmpty, IsNumber, IsEmail } from 'class-validator';

/**
 * DTO para registrar incidencias de un usuario que intenta inciar multiples veces
 */
export class RegisterIncidentDto {
  @IsEmail()
  @IsNotEmpty({ message: "Por favor, es necesario que ingrese el usuario "})
  email: string;
}

export class UsernameIsBlockedDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class FilterUsernameForDaysDto {
  @IsNumber()
  @IsNotEmpty()
  days: number;
}