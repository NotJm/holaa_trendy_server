import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ default: ''})
  sessionId: string;

  @Prop({ required: true })
  @IsNotEmpty({ message: "Por favor, ingrese su nombre de usuario"})
  @MinLength(6, { message: "El nombre de usuario debe tener al menos 6 caracteres"})
  username: string;

  @Prop({ required: true })
  @IsNotEmpty({ message: "Por favor, ingrese su contraseña"})
  @MinLength(8, { message: "La contraseña debe tener al menos 6 caracteres"})
  password: string;

  @Prop({ required: true})
  @IsEmail({}, { message: "Por favor, ingrese un correo valido" })  
  email: string;

  @Prop({ default: false })
  emailIsVerify: boolean;

  @Prop({ default: 'user'})
  role: string
}

export const UserSchema = SchemaFactory.createForClass(User).set('versionKey', false);
  