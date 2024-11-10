import { IsDate, IsOptional, IsString } from 'class-validator';

// Impelementacion de actualizacion de datos mediante la estructura DTO
// propuesta, este cuenta con que todos los campos son opcionalles
export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsDate({ message: 'Por favor ingrese una fecha valida' })
  effective_date?: Date;

}
