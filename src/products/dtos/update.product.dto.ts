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
  Min,
  ValidateNested,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  code: string;

  @IsOptional()
  name: string;

  @IsOptional()
  @IsUrl({}, { message: 'La uri deberia ser un uri valido' })
  imgUri: string;

  @IsOptional()
  @IsArray({ message: 'Las uri deberia ser un arreglo' })
  @ArrayMinSize(2, { message: 'Deberia ser minimo 2 uri' })
  @ArrayMaxSize(4, { message: 'Dberia ser maximo 4 uri' })
  @IsUrl({}, { each: true, message: 'Las uri deberia ser un uri valido' })
  assets: string[];

  @IsOptional()
  description: string;

  @IsOptional()
  @IsNumber({}, { message: 'El precio deberia de ser un numero' })
  @IsPositive({ message: 'El precio deberia de ser un numero entero positivo' })
  @Min(0, { message: 'El precio deberia de tener un valor minimo de 0' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'El stock deberia de ser un numero entero' })
  @IsPositive({ message: 'El stock deberia ser un numero entero positivo' })
  @Min(0, { message: 'El stock deberia de tener un valor minimo de 0' })
  stock: number;

  @IsOptional()
  @IsArray({ message: 'Las tallas deberia ser un arreglo' })
  @IsString({ each: true, message: 'Cada tipo deberia ser un string' })
  sizes: string[];

  @IsOptional()
  @IsArray({ message: 'Los colores deberia ser un arreglo' })
  @IsString({ each: true, message: 'Cada color debereria ser un string' })
  colors: string[];
}

export class UpdateManyProductsDto {
  @IsArray({ message: 'Los productos actualizar deberian ser un arreglo' })
  @ArrayMinSize(1, { message: 'Al menos un producto para actualizar ' })
  @ValidateNested({ each: true })
  @Type(() => UpdateProductDto)
  products: UpdateProductDto[];
}
