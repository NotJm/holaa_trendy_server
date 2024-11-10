import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

// Implementacion de estructura DTO para la creaciones de perfil de la empresa
// este es necesario para su creacion de manera eficiente
export class CreateBusinessProfileDto {
    @IsString()
    @MaxLength(100, { message: "El slogan solo puede contener maximo 100 caracteres"})
    slogan: string

    @IsUrl()
    logo: string;

    @IsString()
    @IsOptional()
    @MaxLength(50, { message: "El titulo de pagina solo puede contener maxim 50 Caracteres"})
    titlePage: string;

    @IsString()
    address: string;

    @IsEmail()
    email: string;

    @IsPhoneNumber("MX")
    phone: string
}

// Implementacion de estructura DTO para la actualizacion de datos
// para el perfil de la empresa
export class UpdtaeBusinessProfileDto {
    @IsOptional()
    @IsString()
    @MaxLength(100, { message: "El slogan solo puede contener maximo 100 caracteres"})
    slogan: string

    @IsOptional()
    @IsUrl()
    logo: string;

    @IsOptional()
    @IsString()
    @IsOptional()
    @MaxLength(50, { message: "El titulo de pagina solo puede contener maxim 50 Caracteres"})
    titlePage: string;

    @IsOptional()
    @IsString()
    address: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsPhoneNumber("MX")
    phone: string
}



