import { IsDate, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { DOCUMENT_TYPE, DOCUMENT_STATE } from '../../../../common/constants/contants';

export class UpdateRegulatoryDocumentDto {
  
  @IsOptional()
  @IsString({ message: 'La url del documento debe ser un texto' })
  @IsUrl({}, { message: 'La url del documento debe ser una url valida' })
  url?: string;

  @IsOptional()

  @IsString({ message: 'El titulo del documento debe ser un texto' })
  title: string;

  @IsOptional()
  @IsString({ message: 'La version del documento debe ser un texto' })
  version?: string = '1.0';

  @IsOptional()
  @IsEnum(DOCUMENT_TYPE, {
    message:
      'El tipo de documento debe ser (Politicas de privacidad, Terminos y condiciones o  Deslinde legal',
  })
  type: DOCUMENT_TYPE;

  @IsOptional()
  @IsEnum(DOCUMENT_STATE, {
    message: 'El estado del documento debe ser (ACTIVO, INACTIVO O ELIMINADO)',
  })
  state: DOCUMENT_STATE;

  @IsOptional()
  @IsDate({
    message: 'Por favor ingrese una fecha de effectividad del documento valida',
  })
  effective_date: Date;
}
