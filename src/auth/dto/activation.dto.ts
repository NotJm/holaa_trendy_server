import { Prop } from "@nestjs/mongoose";
import { IsEmail, IsString } from "class-validator";

export class ActivationDto {
    @IsEmail({}, { message: "Por favor, proporciona un email válido" })
    email: string;

    @IsString({ message: "Por favor, proporciona un codigo otp valido" })
    otp: string;
}

export class ActivationDto2 {
    @IsString({ message: "Por favor, proporciona un codigo otp valido" })
    otp: string;
}