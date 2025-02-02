import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, ValidateNested } from "class-validator";

export class CreateSubCategoryDto {
    @IsNotEmpty({ message: 'El codigo de la sub categoria es requerida '})
    code: string;

    @IsNotEmpty({ message: 'El codigo de la categoria es requerida'})
    category: string;
}

export class CreateManySubCategoriesDto {
    @IsArray({ message: "Sub Categorias Deberia ser un arreglo" })
    @ArrayMinSize(1, { message: "Al menos deberia ser una sub categoria"})
    @ValidateNested({ each: true })
    @Type(() => CreateSubCategoryDto)
    subCategories: CreateSubCategoryDto[]
}