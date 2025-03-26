import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { DOCUMENT_TYPE } from 'src/common/constants/contants';
import { DOCUMENT_STATE } from '../../../../common/constants/contants';

export class CreateRegulatoryDocumentDto {
  @IsString({ message: 'La url del documento debe ser un texto' })
  @IsNotEmpty({ message: 'La url del documento es requerido' })
  @IsUrl({}, { message: 'La url del documento debe ser una url valida' })
  url: string;

  @IsString({ message: 'El titulo del documento debe ser un texto' })
  @IsNotEmpty({ message: 'El titulo del documento es requerido' })
  title: string;

  @IsString({ message: 'La version del documento debe ser un texto' })
  @IsOptional()
  version?: string = '1.0';

  @IsNotEmpty({ message: 'El tipo de documento es requerido' })
  @IsEnum(DOCUMENT_TYPE, {
    message:
      'El tipo de documento debe ser (Politicas de privacidad, Terminos y condiciones o  Deslinde legal',
  })
  type: DOCUMENT_TYPE;

  @IsNotEmpty({ message: 'El estado de documento es requerido' })
  @IsEnum(DOCUMENT_STATE, {
    message: 'El estado del documento debe ser (ACTIVO, INACTIVO O ELIMINADO)',
  })
  state: DOCUMENT_STATE;

  @IsNotEmpty({ message: 'El dia de effectividad del documento es requerido' })
  @IsDate({
    message: 'Por favor ingrese una fecha de effectividad del documento valida',
  })
  effective_date: Date;
}
