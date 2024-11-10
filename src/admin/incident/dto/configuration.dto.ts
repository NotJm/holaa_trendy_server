import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { EmailConfiguration } from "../../email/schemas/email.config.schema";

export class UpdateConfigurationDto {
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    maxFailedAttempts: number;

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    blockDuration: number;

}