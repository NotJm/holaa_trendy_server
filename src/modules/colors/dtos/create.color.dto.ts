import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsHexColor, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class CreateColorDto {
  @IsNotEmpty({ message: 'El nombre del color es requerido'})
  @IsString({ message: 'El nombre del color deberia ser texto'})
  name: string;

  @IsNotEmpty({ message: 'El codigo hexadecimal es requerido' })
  @IsString({ message: 'El codigo hexadecimal deberia ser texto' })
  @IsHexColor({ message: 'El codigo hexadecimal deberia tener formato hexadecimal' })
  hexCode: string;
}

export class CreateManyColorsDto {
  @IsNotEmpty({ message: 'Se requiere el campo colores'})
  @IsArray({ message: 'Colores deberia ser arreglo'})
  @ArrayNotEmpty({ message: 'Se requiere al menos un color en el arreglo'})
  @ValidateNested({ each: true })
  @Type(() => CreateColorDto)
  colors: CreateColorDto[];
}

