import { IsString } from "class-validator";

/**
 * @property {string} otp - Codigo Otp
 */
export class AccountVerificationDto {

    @IsString({ message: "Por favor, proporciona un codigo otp valido" })
    readonly otp: string;

}
