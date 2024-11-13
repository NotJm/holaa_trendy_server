import { Prop } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

// Implementacion de un sistema para la modificacion de documentso regulatorios
// Tipo Politicas de Privacidad, Terminos y Condiciones y Deslinde Legal
export class CreateDocumentDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsDate({ message: "Por favor ingrese una fecha valida"})
  @Type(() => Date)
  readonly effective_date: Date;

  @IsOptional()
  @IsBoolean()
  isDelete?: boolean = false;

  @IsOptional()
  @IsString()
  version?: string = "1.0";

  @IsOptional()
  @IsDate()
  create_date?: Date = new Date;

  @IsOptional()
  @IsDate()
  update_date?: Date = new Date();
}
