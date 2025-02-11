import { IsOptional, IsString, IsUrl } from "class-validator";

// Propuesta de estructura de DTO para la creacion de redes sociales para la empresa
// estas cuentan con propiedades que debe de ser validadas
export class CreateSocialSiteDto {
    @IsString()
    name: string;

    @IsUrl()
    icon: string;

    @IsUrl()
    url: string;

    @IsOptional()
    @IsString()
    description?: string;

}