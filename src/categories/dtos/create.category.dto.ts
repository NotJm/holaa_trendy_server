import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, ValidateNested } from "class-validator";

/**
 * @property {string} name - Nombre de la categoria
 * @property {string} description - Descripcion del tipo de producto
 */
export class CreateCategoryDto {
    @IsNotEmpty({ message: 'El nombre de la categoria es requerido' })
    code: string;

    @IsNotEmpty({ message: 'La descripcion de la categoria es requerida'})
    description: string

}


export class CreateManyCategoriesDto {
    @IsArray({ message: "Categorias deberias ser un arreglo"})
    @ArrayMinSize(1, { message: "Minimo deberia de tener una categoria" })
    @ValidateNested({ each: true })
    @Type(() => CreateCategoryDto)
    categories: CreateCategoryDto[]
}