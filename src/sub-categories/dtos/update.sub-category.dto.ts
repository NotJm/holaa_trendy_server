import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateSubCategoryDto {
  @IsNotEmpty({ message: 'El codigo actual es requerido' })
  @IsString({ message: 'El codigo actual deberia ser texto' })
  code: string;

  @IsOptional()
  @IsString({ message: 'El codigo deberia ser texto' })
  newCode?: string;
  
}

export class UpdateManySubCategoriesDto {
  @IsArray({ message: 'Sub Categorias Deberia ser un arreglo' })
  @ArrayMinSize(1, { message: 'Al menos deberia ser una sub categoria' })
  @ValidateNested({ each: true })
  @Type(() => UpdateSubCategoryDto)
  subCategories: UpdateSubCategoryDto[];
}
