import { Prop } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";

export class LoginDto {
    @Prop({ required: true })
    @IsNotEmpty({ message: "Por favor, ingrese su nombre de usuario" })
    username: string;

    @Prop({ required: true })
    @IsNotEmpty({ message: "Por favor, ingrese su contraseña "})
    password: string;
}