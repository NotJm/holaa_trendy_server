import { Prop } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";


export class ForgotPasswordDto {
    @Prop({ required: true })
    @IsEmail({}, { message: "Por favor, proporciona un correo valido" })
    email: string;
}

export class ResetPasswordDto {
    @Prop({ required: true })
    @IsString()
    @IsNotEmpty({ message: "Por favor, el token es obligatorio" })
    token: string;

    @Prop({ required: true })
    @IsString()
    @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres "})
    new_password: string
}
export class SendEmailVerificationDto {
    @Prop({ required: true })
    @IsEmail({}, { message: "Por favor, proporciona un correo valido" })
    email: string;
}

