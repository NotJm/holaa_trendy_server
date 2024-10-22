import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Document } from 'mongoose';

export type DrDocument = Dr & Document;

@Schema()
export class Dr {
  @Prop({ required: true})
  @IsString()
  id: string;

  @Prop({ required: true })
  @IsString()
  title: string;

  @Prop({ required: true })
  @IsString()
  content: string;

  @Prop({ required: true})
  @IsString()
  email: string;

  @Prop( { required: true })
  @IsDate()
  effective_date: Date;

  @Prop( { required: false, default: Date.now })
  @IsDate()
  create_date: Date;

  @Prop( { required: false, default: Date.now })
  @IsDate()
  update_date: Date;

  @Prop( { required: false, default: '1.0' })
  @IsString()
  version: string;

  @Prop( { required: false, default: false })
  @IsBoolean()
  current: boolean;

  @Prop( { required: false, default: false })
  @IsBoolean()
  is_delete: boolean;

  
}

export const DrSchema = SchemaFactory.createForClass(Dr).set('versionKey', false);
  