import { Prop } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { sanitize } from "class-sanitizer";

export class RegisterDto {
    @Prop({ default: ''})
    sessionId: string;    

    @IsNotEmpty({ message: "Por favor, ingrese su nombre de usuario"})
    @MinLength(6, { message: "El nombre de usuario debe tener al menos 6 caracteres" })
    @Matches(/^[a-zA-Z0-9_]{6,}$/,{ message: "El nombre de usuario solo puede contener caracteres alfanumericos y ocupar '_' como espacio" })
    username: string;
  
    @Prop({ required: true })
    @IsNotEmpty({ message: "Por favor, ingrese su contraseña"})
    @MinLength(8, { message: "La contraseña debe tener al menos 6 caracteres"})
    password: string;
  
    @Prop({ required: true})
    @IsEmail({}, { message: "Por favor, ingrese un correo valido" })  
    email: string;
  
    @Prop({ default: false })
    emailIsVerify: boolean;
}

export class LoginDto {
    @Prop({ required: true })
    @IsNotEmpty({ message: "Por favor, ingrese su nombre de usuario" })
    username: string;

    @Prop({ required: true })
    @IsNotEmpty({ message: "Por favor, ingrese su contraseña "})
    password: string;
}

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

