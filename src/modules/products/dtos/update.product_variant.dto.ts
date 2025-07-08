import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class UpdateProductVariantDto {

  @IsOptional()
  @IsString({ message: 'La talla deberia ser texto'})
  sizeName: string;

  @IsOptional()
  @IsNumber({}, { message: 'El stock deberia de ser un numero entero' })
  @IsPositive({ message: 'El stock debe de ser un entero positivo'})
  @Min(1, { message: 'El minimo valor del stock debe ser 1'})
  stock: number;
  
}