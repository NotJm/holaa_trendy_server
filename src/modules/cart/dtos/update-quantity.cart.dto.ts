import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class UpdateProductQuantityToCartDto {
  @IsNotEmpty({ message: 'El codigo del producto es requerido' })
  @IsString({ message: 'El codigo del producto deberia ser texto' })
  productCode: string;

  @IsNotEmpty({ message: 'La talla del producto es requerida' })
  @IsString({ message: 'La talla del producto deberia ser texto' })
  sizeName: string;

  @IsNotEmpty({ message: 'La cantidad del producto es requerida' })
  @IsInt({ message: 'La cantidad del producto es requerida' })
  @Min(1, { message: 'La cantidad del producto minima es de 1' })
  quantity: number;
}
