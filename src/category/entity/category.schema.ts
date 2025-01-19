import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type CategoryDocument = Category & Document;

/**
 * @prop {string} code - Codigo de la categoria
 * @prop {string} name - Nombre de la categoria
 * @prop {string} description - Descripcion de la categoria
 */
@Schema()
export class Category {
    @Prop({ required: true, type: String, unique: true })
    code: string

    @Prop({ require: true, type: String })
    name: string;

    @Prop({ require: true, type: String })
    description: string

}

export const CategorySchema = SchemaFactory.createForClass(Category).set('versionKey', false);