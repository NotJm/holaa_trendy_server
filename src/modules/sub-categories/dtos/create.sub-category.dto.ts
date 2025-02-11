import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class CreateSubCategoryDto {
    @IsNotEmpty({ message: 'El nombre de la sub categoria es requerida '})
    name: string;

    @IsNotEmpty({ each: true, message: 'Los nombres de la categoría es requerida' })
    @IsString({ each: true, message: 'Cada nombre de categoria debe ser una cadena de texto' })
    @IsArray({ message: 'Los nombres de las categorias deben ser un arreglo' })
    @ArrayMinSize(1, { message: 'Debe proporcionar al menos un nombre de categoria' })
    categoriesNames: string[];
}

export class CreateManySubCategoriesDto {
    @IsArray({ message: "Sub Categorias Deberia ser un arreglo" })
    @ArrayMinSize(1, { message: "Al menos deberia ser una sub categoria"})
    @ValidateNested({ each: true })
    @Type(() => CreateSubCategoryDto)
    subCategories: CreateSubCategoryDto[]
}