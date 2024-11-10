import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailConfiguraionDocument = EmailConfiguration & Document;

@Schema()
export class EmailConfiguration {
  @Prop({ required: true, default: 'Este es un titulo predeterminado de correo...' })
  title: string;

  @Prop({ required: true, default: 'Este es un mensaje predeterminado de correo...'})
  content: string;

  @Prop({ required: true, default: 'Este es un pie de pagina predeterminado de correo'})
  footer: string;
}

export const EmailConfigurationSchema = SchemaFactory.createForClass(EmailConfiguration).set('versionKey', false);;
