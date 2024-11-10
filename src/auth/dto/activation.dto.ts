import { IsString } from "class-validator";

// Implementacion de DTO solo para la activacion de correo donde solamente
// gracias a los cambios recientes solo necesita el codigo OTP
export class ActivationDto {
    @IsString({ message: "Por favor, proporciona un codigo otp valido" })
    readonly otp: string;
}
