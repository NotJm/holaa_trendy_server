import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { BaseSchema } from "src/shared/base.schema";

export type UserOtpDocument = UserOtp & Document;

@Schema()
export class UserOtp extends BaseSchema {

    @Prop({ required: true, type: SchemaTypes.ObjectId, ref: "Users" })
    userId: string

    @Prop({ required: true, type: String })
    useCase: "LOGIN" | "SIGNUP" | "F_PASSWORD";

    @Prop({ required: true, type: String })
    otp: string
  
    @Prop({ required: true, type: Date })
    expiresAt: Date;

} 

export const UserOtpSchema = SchemaFactory.createForClass(UserOtp).set('versionKey', false);