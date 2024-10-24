import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailMessageDocument = EmailMessage & Document;

@Schema()
export class EmailMessage {
  @Prop({ required: true, default: 'Este es un mensaje predeterminado de correo...' })
  message: string;
}

export const EmailMessageSchema = SchemaFactory.createForClass(EmailMessage);
