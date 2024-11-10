import { Prop } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @Prop({ required: true })
    @IsNotEmpty({ message: "Por favor, ingrese su correo electronico" })
    @IsEmail()
    email: string;

    @Prop({ required: true })
    @IsNotEmpty({ message: "Por favor, ingrese su contraseña "})
    password: string;
}