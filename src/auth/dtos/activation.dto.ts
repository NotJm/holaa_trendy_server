import { IsNotEmpty, IsString } from "class-validator";

/**
 * @property {string} otp - Codigo Otp
 */
export class AccountActivationDto {

    @IsNotEmpty({ message: "Por favor, se requiere este campo" })
    @IsString({ message: "Por favor, proporciona un codigo otp valido" })
    readonly otp: string;

}
