import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EmailConfiguration, EmailConfigurationSchema } from '../../email/schemas/email.config.schema';

export type IncidentConfigurationDocument = IncidentConfiguration & Document;
// Configuracion para el modulo de incidencias, se tiene que crear para personalizar ciertas
// cuestiones del modulo de incidencias, intentos de maximos para loguearse
// duracion del bloqueo, tiempo vida del json web token y otpCode
@Schema()
export class IncidentConfiguration {
  
  @Prop({ required: true, default: 5 })
  maxFailedAttempts: number;

  @Prop({ required: true, default: 60 }) 
  blockDuration: number;

  @Prop({ required: true, default: 300})
  otpLifeTime: number;

}

export const IncidentConfigurationSchema = SchemaFactory.createForClass(IncidentConfiguration).set('versionKey', false);
