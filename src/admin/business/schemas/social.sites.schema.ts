import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsDate, IsString, IsUrl } from "class-validator";
import { Document } from "mongoose";

export type SocialSiteDocument = SocialSite & Document;


@Schema()
export class SocialSite{
    @Prop({ require: true, default: '' })
    name: string

    @Prop({ required: true, default: '' })
    icon: string

    @Prop({ required: true, default: '' })
    url: string;

    @Prop({ required: false, default: '' })
    description: string;

    @Prop({ required: false, default: Date.now })
    readonly create_date: Date;

    @Prop({ required: false, default: Date.now })
    update_date: Date;


}

export const SocialSiteSchema = SchemaFactory.createForClass(SocialSite).set('versionKey', false);


