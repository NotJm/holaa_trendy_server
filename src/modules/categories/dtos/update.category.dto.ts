import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export class UpdateCategoryDto {
    @IsNotEmpty({ message: 'Se requiere identificador de la categoria' })
    @IsUUID('all', { message: 'El identificador de la categoria deberia ser UUID' })
    id: string;

    @IsOptional()
    @IsString({ message: "El nombre de la categoria deberia ser texto" })
    newName?: string

    @IsOptional()
    @IsString({ message: "La descripcion deberia ser texto" })
    newDescription?: string
}


export class UpdateManyCategoriesDto {
    @IsArray({ message: "Deberia ser un arreglo de categorias" })
    @ArrayMinSize(1, { message: "Debe incluir al menos una categoria" })
    @ValidateNested({ each: true })
    @Type(() => UpdateCategoryDto)
    categories: UpdateCategoryDto[];
}