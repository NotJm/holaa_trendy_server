import { Prop } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @Prop({ required: true })
  @IsEmail({}, { message: 'Por favor, proporciona un correo valido' })
  email: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El código OTP es obligatorio' })
  otpCode: string;

  @IsString()
  @MinLength(8, {
    message: 'La nueva contraseña debe tener al menos 8 caracteres',
  })
  new_password: string;
}
