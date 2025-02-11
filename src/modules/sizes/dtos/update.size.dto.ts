import { Type } from "class-transformer"
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"

export class UpdateSizeDto {
  @IsNotEmpty({ message: "El ID de la talla es requerido" })
  @IsUUID("4", { message: "El ID de la talla debe ser un UUID válido" })
  id: string

  @IsOptional()
  @IsString({ message: "El nuevo tamaño de la talla debería ser texto" })
  newSize?: string
}

export class UpdateManySizesDto {
  @IsNotEmpty({ message: "Se requiere el campo tallas" })
  @IsArray({ message: "Tallas debería ser un arreglo" })
  @ArrayNotEmpty({ message: "Se requiere al menos una talla en el arreglo" })
  @ValidateNested({ each: true })
  @Type(() => UpdateSizeDto)
  sizes: UpdateSizeDto[]
}

