import { Prop } from "@nestjs/mongoose";
import { IsEmail, IsString } from "class-validator";

export class ActivationDto {
    @Prop({ required: true })
    @IsEmail({}, { message: "Por favor, proporciona un email válido" })
    email: string;

    @Prop({ required: true })
    @IsString({ message: "Por favor, proporciona un codigo otp valido" })
    otp: string;
}