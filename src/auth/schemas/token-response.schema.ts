import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "src/shared/base.schema";
import { User } from "src/users/schemas/user.schema";

export type TokenResponseDocument = TokenResponse & Document;

/**
 * @prop {string} token - Valor del token
 * @prop {User} user_id - Identificador Unico
 * @prop {Date} expires_at - Expiracion del token
  */
@Schema()
export class TokenResponse extends BaseSchema {
    @Prop({required: [true, 'El valor del token es requerido'], type: String, unique: true})
    token: string

    @Prop({ required: true, ref: "User" })
    user_id: User

    @Prop({ required: true, type: Date })
    expires_at: Date
    
}

export const TokenResponseSchema = SchemaFactory.createForClass(TokenResponse).set("versionKey", false);