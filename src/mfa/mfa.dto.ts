import { IsEmail } from "class-validator";

export class GenerateMfaSecretDto {
    @IsEmail({}, { message: "Por favor, Ingresar un email valido"})
    email: string;
}