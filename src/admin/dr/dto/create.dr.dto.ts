import { Prop } from "@nestjs/mongoose";
import { IsDate, IsString } from "class-validator";

export class CreateDrDto {
    @Prop( { required: true }) 
    @IsString()
    title: string

    @Prop( { required: true }) 
    @IsString()
    content: string;

    @Prop( { required: true })
    @IsDate()
    effective_date: Date;
    
}