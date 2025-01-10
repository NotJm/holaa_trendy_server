import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { BaseSchema } from "src/shared/base.schema";

export type ProductsDocument = Products & Document;

/**
 * @prop {string} code - Codigo de la prenda
 * @prop {string} img_uri - Imagen de la prenda
 * @prop {string} description - Descripcion de la prenda
 * @prop {string} type - Tipo de prenda
 * @prop {Category} category - Categoria
 * @prop {number} price - Precio de la prenda
 * @prop {number} stock - Numero de prendas en el inventario
 * @prop {string[]} size - Talla de la prenda
 */
@Schema()
export class Products extends BaseSchema {
    @Prop({ required: true, type: String})
    code: string

    @Prop({ required: true, type: String })
    imgUri: string

    @Prop({ required: true, type: String })
    description: string;

    //TODO: []
    @Prop({ required: true, type: String })
    type: string;

    @Prop({ required: true, type: Number, min: 0 })
    price: number;

    // @Prop({ required: false, type: [{type: mongoose.Schema.ObjectId, ref:"Category"}], default: []})
    // categories: string[]

    @Prop({ require: false, type: Number, min: 0, default: 0 })
    stock: number;

    @Prop({ require: false, type: [String], default: [] })
    size: string[]

}

export const ProductsSchema = SchemaFactory.createForClass(Products).set("versionKey", false);

ProductsSchema.pre('save', async () => {

})