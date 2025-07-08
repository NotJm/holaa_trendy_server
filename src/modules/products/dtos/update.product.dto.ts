import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { UpdateProductVariantDto } from './update.product_variant.dto';

export class UpdateProductDto {
  @IsString()
  code: string;

  @IsOptional()
  name: string;

  @IsOptional()
  @IsUrl({}, { message: 'La uri deberia ser un uri valido' })
  imgUri: string;

  @IsOptional()
  @IsArray({ message: 'Las imagenes deberian estar en un arreglo' })
  @ArrayMinSize(2, { message: 'Minimo 2 imagenes para el producto' })
  @ArrayMaxSize(8, { message: 'Maximpo 8 imagenes para el producto' })
  @IsUrl({}, { each: true, message: 'La imagenes deberia ser un url valido' })
  images: string[];

  @IsOptional()
  description: string;

  @IsOptional()
  @IsNumber({}, { message: 'El precio deberia de ser un numero' })
  @IsPositive({ message: 'El precio deberia de ser un numero entero positivo' })
  @Min(0, { message: 'El precio deberia de tener un valor minimo de 0' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'El descuento deberia ser numero' })
  @Min(0, { message: 'El minimo valor del descuento deberia ser 0' })
  @Max(100, { message: 'El maximo valor del descuento deberia ser 100' })
  discount: number;

  @IsOptional()
  @IsString({ message: 'La categoria deberia ser string' })
  categoryName: string;

  @IsOptional()
  @IsArray({ message: 'Las subs categorias debeeria ser un requeridas' })
  @ArrayMinSize(1, { message: 'Deberia ser al menos una sub categoria' })
  @IsString({ each: true, message: 'Cada sub categoria deberia seria string' })
  subCategoriesNames: string[];

  @IsOptional()
  @IsString({ message: 'El color deberia ser texto' })
  colorName: string;

  @IsOptional()
  @IsArray({ message: 'Las tallas deberia ser un arreglo' })
  @ArrayMinSize(1, { message: 'Al menos una talla en el arreglo' })
  @ValidateNested({ each: true })
  @Type(() => UpdateProductVariantDto)
  variants: UpdateProductVariantDto[];
}

export class UpdateManyProductsDto {
  @IsArray({ message: 'Los productos actualizar deberian ser un arreglo' })
  @ArrayMinSize(1, { message: 'Al menos un producto para actualizar ' })
  @ValidateNested({ each: true })
  @Type(() => UpdateProductDto)
  products: UpdateProductDto[];
}
