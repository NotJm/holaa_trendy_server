import { Prop } from "@nestjs/mongoose";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
    @Prop({ required: true })
    @IsString()
    @IsNotEmpty({ message: "Por favor, el nombre de usuario es obligatorio" })
    username: string;


    @Prop({ required: true })
    @IsString()
    @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres "})
    password: string


    @Prop({ required: true })
    @IsString()
    @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres "})
    new_password: string
}