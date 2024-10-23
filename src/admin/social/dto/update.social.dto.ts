import { IsOptional, IsString, IsUrl } from "class-validator";


export class updateSocialSiteDto {

    @IsOptional()
    @IsString()
    readonly name?: string;

    @IsOptional()
    @IsString()
    readonly icon?: string;

    @IsOptional()
    @IsUrl()
    readonly url?: string;

    @IsOptional()
    @IsString()
    readonly description?: string;

    
}