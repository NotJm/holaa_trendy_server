import { IsNotEmpty } from "class-validator";

export class MFACodeDto {
    @IsNotEmpty({ message: "El codigo OTP es requerido" })
    otp: string;
}