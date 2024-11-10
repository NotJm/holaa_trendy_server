import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BusinessDocument = Business & Document;


// Implementacion de un esquema dedicado totalmente a ciertos aspectos de la empresa
// los atributos como slogan, logo, titulo de pagina y datos del contacto
@Schema()
export class Business{
    @Prop({ required: true, default: '', maxlength: 100 })
    slogan: string 

    @Prop({ required: true, default: '' })
    logo: string;

    @Prop({ required: true, default: '', maxlength: 50})
    titlePage: string

    @Prop({ required: true, default: ''})
    address: string

    @Prop({ required: true, default: ''})
    email: string

    @Prop({ required: true, default: ''})
    phone: string

    @Prop({ required: false, default: Date.now })
    readonly create_date: Date;

    @Prop({ required: false, default: Date.now })
    update_date: Date;

}

export const BusinessSchema = SchemaFactory.createForClass(Business).set('versionKey', false);


