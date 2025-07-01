import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductVariantDto {

  @IsNotEmpty({ message: 'La talla del producto es requerida'})
  @IsString({ message: 'La talla deberia ser texto'})
  size: string;

  @IsNotEmpty({ message: 'El color del producto es requerida'})
  @IsString({ message: 'El color deberia ser texto'})
  color: string;

  @IsNotEmpty({ message: 'El stock del producto es requerido'})
  @IsNumber({}, { message: 'El stock deberia de ser un numero entero' })
  @IsPositive({ message: 'El stock debe de ser un entero positivo'})
  @Min(1, { message: 'El minimo valor del stock debe ser 1'})
  stock: number;
  
}