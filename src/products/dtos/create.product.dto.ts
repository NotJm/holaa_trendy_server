import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'El codigo del producto es requerido' })
  code: string;

  @IsNotEmpty({ message: 'El nombre del producto es necesario'})
  name:string;

  @IsNotEmpty({ message: 'La uri de la imagen del producto es requerida' })
  @IsUrl({}, { message: 'La uri deberia ser un uri valido' })
  imgUri: string;

  @IsNotEmpty()
  @IsArray({ message: 'Las uri deberia ser un arreglo'})
  @ArrayMinSize(2, { message: 'Deberia ser minimo 2 uri'})
  @ArrayMaxSize(4, { message: 'Dberia ser maximo 4 uri'})
  @IsUrl({}, { each: true, message: 'Las uri deberia ser un uri valido' })
  images: string[]

  @IsNotEmpty({ message: 'La descripcion del producto es requerida' })
  description: string;

	@IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber({}, { message: 'El precio deberia de ser un numero' })
  @IsPositive({ message: 'El precio deberia de ser un numero entero positivo' })
  @Min(0, { message: 'El precio deberia de tener un valor minimo de 0' })
  price: number;

	@IsNotEmpty({ message: 'El stock es requerido' })
  @IsNumber({}, { message: 'El stock deberia de ser un numero entero' })
  @IsPositive({ message: 'El stock deberia ser un numero entero positivo'})
  @Min(0, { message: 'El stock deberia de tener un valor minimo de 0'})
  stock: number;

	@IsNotEmpty({ message: 'Las tallas del producto son requeridas'})
  @IsArray({ message: 'Las tallas deberia ser un arreglo' })
  sizes: string[];

  @IsNotEmpty({ message: 'Los colores del producto son requeridas'})
  @IsArray({ message: 'Los colores deberia ser un arreglo' })
  @IsHexColor({ each: true, message: 'Cada color debereria ser estilo hexadecimal'})
  colors: string[];

  @IsNotEmpty({ message: 'La categoria es requerida' })
  @IsString({ message: 'La categoria deberia ser string' })
  category: string;

  @IsNotEmpty({ message: 'Las subs categorias es requerida'})
  @IsArray({ message: 'Las subs categorias debeeria ser un requeridas'})
  @ArrayMinSize(1, { message: 'Deberia ser al menos una sub categoria'})
  @IsString({ each: true, message: 'Cada sub categoria deberia seria string'})
  subCategories: string[]

}

export class CreateManyProductsDto {
  @IsArray({ message: 'Los productos deberian ser un arreglo' })
  @ArrayMinSize(1, { message: 'Al menos un producto deberia estar' })
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  products: CreateProductDto[];
}
