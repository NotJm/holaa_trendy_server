import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Category } from "src/category/schemas/category.schema";

export type ProductsDocument = Products & Document;

/**
 * @prop {string} code - Codigo de la prenda
 * @prop {string} img_uri - Imagen de la prenda
 * @prop {string} description - Descripcion de la prenda
 * @prop {string} type - Tipo de prenda
 * @prop {object} category - Categoria
 * @prop {number} price - Precio de la prenda
 * @prop {number} stock - Numero de prendas en el inventario
 * @prop {string[]} size - Talla de la prenda
 */
@Schema()
export class Products {
    @Prop({ required: true, type: String})
    code: string

    @Prop({ required: true, type: String })
    img_uri: string

    @Prop({ required: true, type: String })
    description: string;

    // @Prop({ require: false, default: Array<String> })
    // color: Array<String>

    @Prop({ required: true, type: String })
    type: string

    @Prop({ required: true, type: mongoose.Schema.ObjectId, ref:"Category" })
    category: Category

    @Prop({ required: true, type: Number, min: 0 })
    price: number;

    @Prop({ require: true, type: Number, min: 0 })
    stock: number;

    @Prop({ require: true, type: [String] })
    size: Array<String>

}

export const ProductsSchema = SchemaFactory.createForClass(Products).set("versionKey", false);