import { IsNotEmpty, IsOptional, IsPostalCode } from "class-validator";

export class RegisterAddressDto {
    @IsNotEmpty({ message: "Se requiere direccion del usuario" })
    address: string;

    @IsNotEmpty({ message: "Se requiere un codigo postal" })
    @IsPostalCode('MX', { message: "Se requiere un codigo postal de mexico"})
    postCode: string;

    @IsNotEmpty({ message: "Se requiere estado" })
    state: string;

    @IsNotEmpty({ message: "Se requiere municipio" })
    municipality: string;

    @IsNotEmpty({ message: "Se requiere una ciudad" })
    town: string;

    @IsNotEmpty({ message: "Se requiere una colonia" })
    colony: string;

    @IsOptional()
    description: string;



}