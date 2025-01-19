import { IsNotEmpty, IsOptional, IsPostalCode } from "class-validator";

export class UpdateAddressDto {
    @IsOptional()
    @IsNotEmpty({ message: "Se requiere direccion del usuario" })
    address: string;

    @IsOptional()
    @IsNotEmpty({ message: "Se requiere un codigo postal" })
    @IsPostalCode('MX', { message: "Se requiere un codigo postal de mexico"})
    postCode: string;

    @IsOptional()
    @IsNotEmpty({ message: "Se requiere estado" })
    state: string;

    @IsOptional()
    @IsNotEmpty({ message: "Se requiere municipio" })
    municipality: string;

    @IsOptional()
    @IsNotEmpty({ message: "Se requiere una ciudad" })
    town: string;

    @IsOptional()
    @IsNotEmpty({ message: "Se requiere una colonia" })
    colony: string;

    @IsOptional()
    description: string;



}