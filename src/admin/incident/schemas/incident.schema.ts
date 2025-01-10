import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BaseSchema } from 'src/shared/base.schema';

export type IncidentsDocument = Incidents & Document;

@Schema()
export class Incidents extends BaseSchema {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: "Users" })
  userId: string;

  @Prop({ required: false, type: Number, default: 1 })
  failedAttempts?: number;

  @Prop({ required: false, type: Date, default: Date.now})
  lastAttempt?: Date;

}

export const IncidentsSchema = SchemaFactory.createForClass(Incidents).set('versionKey', false);
