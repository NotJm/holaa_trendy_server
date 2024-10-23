import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString, IsUrl } from "class-validator";
import { Document } from "mongoose";

export type SocialSiteDocument = SocialSite & Document;


@Schema()
export class SocialSite{
    @Prop({ require: true })
    @IsString()
    name: string

    @Prop({ required: true })
    @IsString()
    icon: string

    @Prop({ required: true })
    @IsUrl()
    url: string;

    @Prop({ required: false })
    @IsString()
    description: string;
}

export const SocialSiteSchema = SchemaFactory.createForClass(SocialSite).set('versionKey', false);


