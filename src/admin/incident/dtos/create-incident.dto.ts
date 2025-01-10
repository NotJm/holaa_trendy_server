import { IsNotEmpty } from "class-validator";

/**
 * DTO para registrar incidencias de un usuario que itenta inciar multiples veces
 */
export class CreateIncidentDto {
    @IsNotEmpty({ message: "Se requiere identificador unico de usuario" })
    userId: string;
}