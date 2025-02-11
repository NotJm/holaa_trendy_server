import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class UpdateSubCategoryDto {
  @IsNotEmpty({ message: 'Se requiere identificador de la sub categoria' })
  @IsUUID('all', {
    message: 'El identificador de la sub categoria deberia ser UUID',
  })
  id: string;

  @IsOptional()
  @IsString({ message: 'El codigo deberia ser texto' })
  newName?: string;

  @IsArray({
    message: 'Las categorías deben ser proporcionadas como un array.',
  })
  @ArrayNotEmpty({ message: 'Debe proporcionar al menos una categoría.' })
  @IsString({
    each: true,
    message: 'Cada categoría debe ser una cadena de texto.',
  })
  @IsOptional()
  newCategoriesNames?: string[];
}

export class UpdateManySubCategoriesDto {
  @IsArray({ message: 'Sub Categorias Deberia ser un arreglo' })
  @ArrayMinSize(1, { message: 'Al menos deberia ser una sub categoria' })
  @ValidateNested({ each: true })
  @Type(() => UpdateSubCategoryDto)
  subCategories: UpdateSubCategoryDto[];
}
