import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDate, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type DrDocument = DocumentRegulatory & Document;

// Creacion de esquema para poder estructura los datos en
// la base de datos de esta manera es mas facil modularizar
@Schema()
export class DocumentRegulatory {
  @Prop({ required: true })
  @IsString()
  title: string;

  @Prop({ required: true })
  @IsString()
  content: string;

  @Prop({ required: true })
  @IsDate({ message: 'Por favor, ingrese un correo electronico valido' })
  effective_date: Date;

  @Prop({ required: false, default: '1.0' })
  @IsString()
  version: string;

  @Prop({ required: false, default: false })
  @IsBoolean()
  current: boolean;

  @Prop({ required: false, default: false })
  @IsBoolean()
  isDelete: boolean;

  @Prop({ required: false, default: Date.now })
  @IsDate()
  create_date: Date;

  @Prop({ required: false, default: Date.now })
  @IsDate()
  update_date: Date;
}

export const DrSchema = SchemaFactory.createForClass(DocumentRegulatory).set(
  'versionKey',
  false,
);
