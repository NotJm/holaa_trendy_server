import { Type } from "class-transformer"
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator"

export class CreateSizeDto {
  @IsNotEmpty({ message: "El tamaño de la talla es requerido" })
  @IsString({ message: "El tamaño de la talla debería ser texto" })
  name: string
}

export class CreateManySizesDto {
  @IsNotEmpty({ message: "Se requiere el campo tallas" })
  @IsArray({ message: "Tallas debería ser un arreglo" })
  @ArrayNotEmpty({ message: "Se requiere al menos una talla en el arreglo" })
  @ValidateNested({ each: true })
  @Type(() => CreateSizeDto)
  sizes: CreateSizeDto[]
}

