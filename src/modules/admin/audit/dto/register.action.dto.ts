import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class RegisterActionDto {
    @IsNotEmpty({ message: "Se requiere nombre de usuario" })
    @IsString()
    username: string;

    @IsNotEmpty({ message: "Se requiere la accion del usuario" })
    @IsString()
    action: string;

    @IsNotEmpty({ message: "Se requiere descripcion detallada" })
    @IsString()
    details: string;

    @IsNotEmpty({ message: "Se requiere una fecha valida" })
    @IsDate()
    date: Date

}