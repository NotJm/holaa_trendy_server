import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PolicyDocument = Policy & Document;

@Schema()
export class Policy {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PolicySchema = SchemaFactory.createForClass(Policy);
