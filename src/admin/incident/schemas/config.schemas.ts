import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConfigDocument = Config & Document;

@Schema()
export class Config {
  @Prop({ required: true, default: 5 })
  maxFailedAttempts: number;

  @Prop({ required: true, default: 60 }) // Duración del bloqueo en minutos
  blockDuration: number;
}

export const ConfigSchema = SchemaFactory.createForClass(Config).set('versionKey', false);
