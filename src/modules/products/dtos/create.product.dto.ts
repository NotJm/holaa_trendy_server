import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateProductVariantDto } from './create.product_variant.dto';

export class CreateProductDto {
  @IsNotEmpty({ message: 'El codigo del producto es requerido' })
  code: string;

  @IsNotEmpty({ message: 'El nombre del producto es necesario' })
  name: string;

  @IsNotEmpty({ message: 'La uri de la imagen del producto es requerida' })
  @IsUrl({}, { message: 'La uri deberia ser un uri valido' })
  imgUri: string;

  @IsNotEmpty({ message: 'La imagene son requeridas' })
  @IsArray({ message: 'Las imagenes deberian estar en un arreglo' })
  @ArrayMinSize(2, { message: 'Minimo 2 imagenes para el producto' })
  @ArrayMaxSize(8, { message: 'Maximpo 8 imagenes para el producto' })
  @IsUrl({}, { each: true, message: 'La imagenes deberia ser un url valido' })
  images: string[];

  @IsNotEmpty({ message: 'La descripcion del producto es requerida' })
  description: string;

  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber({}, { message: 'El precio deberia de ser un numero' })
  @IsPositive({ message: 'El precio deberia de ser un numero entero positivo' })
  @Min(0, { message: 'El precio deberia de tener un valor minimo de 0' })
  price: number;

  @IsNumber({}, { message: 'El descuento deberia ser numero' })
  @Min(0, { message: 'El minimo valor del descuento deberia ser 0' })
  @Max(100, { message: 'El maximo valor del descuento deberia ser 100' })
  discount: number;

  @IsNotEmpty({ message: 'La categoria es requerida' })
  @IsString({ message: 'La categoria deberia ser string' })
  categoryName: string;

  @IsNotEmpty({ message: 'Las subs categorias es requerida' })
  @IsArray({ message: 'Las subs categorias debeeria ser un requeridas' })
  @ArrayMinSize(1, { message: 'Deberia ser al menos una sub categoria' })
  @IsString({ each: true, message: 'Cada sub categoria deberia seria string' })
  subCategoriesNames: string[];

  @IsNotEmpty({ message: 'Las tallas del producto son requeridas' })
  @IsArray({ message: 'Las tallas deberia ser un arreglo' })
  @ArrayMinSize(1, { message: 'Al menos una talla en el arreglo' })
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}

export class CreateManyProductsDto {
  @IsArray({ message: 'Los productos deberian ser un arreglo' })
  @ArrayMinSize(1, { message: 'Al menos un producto deberia estar' })
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  products: CreateProductDto[];
}
