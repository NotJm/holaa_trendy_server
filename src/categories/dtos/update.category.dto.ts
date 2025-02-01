import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
/**
 * @property {string} name - Nombre de la categoria
 * @property {string} description - Descripcion de la categoria
 */
export class UpdateCategoryDto {
    @IsString({ message: "El codigo actual deberia ser texto"})
    code: string;

    @IsOptional()
    @IsString({ message: "El codigo deberia ser texto" })
    newCode?: string

    @IsOptional()
    @IsString({ message: "La descripcion deberia ser texto" })
    description?: string
}

/**
 * Estructura para actualizar categorias
 */
export class UpdateManyCategoriesDto {
    @IsArray({ message: "Deberia ser un arreglo de categorias" })
    @ArrayMinSize(1, { message: "Debe incluir al menos una categoria" })
    @ValidateNested({ each: true })
    @Type(() => UpdateCategoryDto)
    categories: UpdateCategoryDto[];
}