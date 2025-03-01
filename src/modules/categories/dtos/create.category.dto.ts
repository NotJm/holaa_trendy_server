import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsUrl, ValidateNested } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'El nombre de la categoria es requerido' })
    name: string;

    @IsNotEmpty({ message: 'La descripcion de la categoria es requerida'})
    description: string

    @IsNotEmpty({ message: 'La imagen de la categoria es requerida' })
    @IsUrl({}, { message: 'La imagen de la categoria deberia ser una URL valida'})
    imgUri: string;

}


export class CreateManyCategoriesDto {
    @IsArray({ message: "Categorias deberias ser un arreglo"})
    @ArrayMinSize(1, { message: "Minimo deberia de tener una categoria" })
    @ValidateNested({ each: true })
    @Type(() => CreateCategoryDto)
    categories: CreateCategoryDto[]
}