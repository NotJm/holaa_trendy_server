import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateEmailConfigurationDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    content: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    footer: number;
}