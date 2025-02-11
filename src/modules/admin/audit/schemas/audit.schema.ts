import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AuditDocument = Audit & Document;


// Implementacion de esquema que controla que usuario hicieron valga la redundancia
// cambios como por ejemplo el perfil de la empresa, redes sociales, etc.
@Schema()
export class Audit{
    @Prop({ required: true})
    username: string 

    @Prop({ required: true })
    action: string;

    @Prop({ required: true })
    details: string

    @Prop({ required: true})
    date: Date

}

export const AuditSchema = SchemaFactory.createForClass(Audit).set('versionKey', false);


