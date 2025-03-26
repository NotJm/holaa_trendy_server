import { IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";

export class SendSmsDto {
  @IsNotEmpty()
  @IsPhoneNumber('MX', { message: 'El numero de telefono debe ser de Mexico' })
  phone: string;
}

export class VerifySmsDto {
  @IsNotEmpty()
  @IsPhoneNumber('MX', { message: 'El numero de telefono debe ser de Mexico' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'El código debe tener exactamente 6 caracteres' })
  code: string;
}
