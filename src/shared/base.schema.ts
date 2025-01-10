import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * @prop {Date} created_at - Fecha de creacion
 * @prop {Date} updated_at - Fecha de actualizacion
 */
@Schema({ timestamps: { createdAt: 'create_date', updatedAt: 'update_at' } })
export class BaseSchema {
  @Prop({ required: false, type: Date, default: Date.now })
  create_date?: Date;

  @Prop({ required: false, type: Date, default: Date.now })
  update_date?: Date;
}

const BaseSchemaSchema = SchemaFactory.createForClass(BaseSchema)

BaseSchemaSchema.pre('save', function (next) {
  this.update_date = new Date();
  next();
})


