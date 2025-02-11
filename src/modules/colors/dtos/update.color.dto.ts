import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsHexColor, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export class UpdateColorDto {
  @IsNotEmpty({ message: "El identificador del color es requerido "})
  @IsUUID('all', { message: 'El identificador del color deberia ser UUID' })
  @IsString({ message: 'El identificador del color deberia ser texto' })
  id: string;
  
  @IsOptional()
  @IsString({ message: 'El nuevo nombre deberia ser texto' })
  newName: string;

  @IsOptional()
  @IsHexColor({ message: 'El codigo de color deberia ser hexadecimal'})
  newHexCode: string;

}

export class UpdateManyColorsDto {
  @IsNotEmpty({ message: 'Se requiere el campo colores'})
    @IsArray({ message: 'Colores deberia ser arreglo'})
    @ArrayNotEmpty({ message: 'Se requiere al menos un color en el arreglo'})
    @ValidateNested({ each: true })
    @Type(() => UpdateColorDto)
    colors: UpdateColorDto[];
}