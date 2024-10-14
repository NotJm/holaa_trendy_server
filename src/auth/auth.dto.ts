import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty({ message: "Por favor, ingrese su nombre de usuario" })
    username: string;

    @IsNotEmpty({ message: "Por favor, ingrese su contraseña "})
    password: string;
}

export class ForgotPasswordDto {
    @IsEmail({}, { message: "Por favor, proporciona un correo valido" })
    email: string;
}

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty({ message: "Por favor, el token es obligatorio" })
    token: string;

    @IsString()
    @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres "})
    new_password: string
}

export class FilterPasswordDto {
    @IsString()
    @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres"})
    password: string;
}