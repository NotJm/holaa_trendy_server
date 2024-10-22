import { Prop } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

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