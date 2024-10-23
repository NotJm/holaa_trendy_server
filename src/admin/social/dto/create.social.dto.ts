import { IsOptional, IsString, IsUrl } from "class-validator";


export class CreateSocialSiteDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly icon: string;

    @IsUrl()
    readonly url: string;

    @IsOptional()
    @IsString()
    readonly description?: string;

}