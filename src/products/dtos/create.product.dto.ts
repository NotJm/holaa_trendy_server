import { IsArray, IsInt, IsNotEmpty, IsNumber, IsUrl, Min } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty({ message: "Se requiere codigo de producto" })
    code: string;

    @IsNotEmpty({ message: "Se requiere una URL para el producto" })
    @IsUrl({}, { message: "Se requiere un URL valido" })
    img_uri: string;

    @IsNotEmpty({ message: "Se requiere una descripcion para el producto" })
    description: string;

    @IsNotEmpty({ message: "Se requiere especificar el tipo de producto" })
    type:string;

    @IsArray({ message: "Se requiere que se establezca en un arreglo -> []"})
    categories: string[];


    @IsNumber({}, { message: "Se requiere el precio del producto" })
    @Min(0, { message: "El valor minimo no puede ser menor que 0" })
    price: number;

    @IsInt({ message: "Se requiere el stock del producto" })
    stock: number;

    @IsArray({ message: "Se requiere tallas del producto"})
    size: [string];
}