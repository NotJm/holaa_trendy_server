import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

/**
 * @prop {string} address - Direccion del Usuario
 * @prop {string} postCode - Codigo Postal
 * @prop {string} state - Estado
 * @prop {string} municipality - Municipio
 * @prop {string} town - Localidad
 * @prop {string} colony - Colonia
 * @prop {string} description - Descripcion o indicaciones de entrega
 */ 
@Schema()
export class UsersAddress {
  @Prop({ required: false, type: String, default: ""})
  address: string

  @Prop({ required: false, type: String, default: ""})
  postCode: string

  @Prop({ required: false, type: String, default: ""})
  state: string; 

  @Prop({ required: false, type: String, default: ""})
  municipality: string;

  @Prop({ required: false, type: String, default: ""})
  town: string

  @Prop({ required: false, type: String, default: ""})
  colony: string

  @Prop({ required: false, type:String, default: ""})
  description: string;
}

export const UsersAddressSchema = SchemaFactory.createForClass(UsersAddress).set('versionKey', false);