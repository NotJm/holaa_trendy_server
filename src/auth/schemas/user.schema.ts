import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray, IsDate, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

// Implementacion de esquema de usuario para ser lanzado
// como coleccion en la base de  datos
// Atributos:
// sessionId: se encarga de manejar las sesiones que tiene usuario
// TODO sigue en proceso el correcto uso de este atributo
// username: Nombre de usuario es requerido
// password: Contraseña que da el usuario y que respeta ciertas caracteristicas
// email: Correo del usuario
// verification: Verificacion, menciona si el usuario se encuentra verificado
// role: Por defecto un usuario tiene el role basico ('user') pero para administrador se cambia desde la base de datos
@Schema()
export class User {
  @Prop({ default: ''})
  sessionId?: string;

  
  @Prop({ required: true })
  @IsNotEmpty({ message: "Por favor, ingrese su nombre de usuario"})
  @MinLength(5, { message: "El nombre de usuario debe tener al menos 6 caracteres"})
  username: string;

  @Prop({ required: true })
  @IsNotEmpty({ message: "Por favor, ingrese su contraseña"})
  @MinLength(8, { message: "La contraseña debe tener al menos 6 caracteres"})
  password: string;

  @Prop({ required: true})
  @IsEmail({}, { message: "Por favor, ingrese un correo valido" })  
  email: string;

  @Prop({ default: false })
  verification?: boolean;

  @Prop({ default: 'user' })
  role?: string

  @Prop({ default: '' })
  otpCode?: string

  @Prop({ default: null })
  otpExpiration?: Date;

  @Prop({ default: [] })
  @IsArray()
  permissions?: string[];

  @Prop({ default: Date.now })
  @IsDate()
  readonly create_date?: Date;

  @Prop({ default: Date.now })
  @IsDate()
  readonly update_date?: Date
}

export const UserSchema = SchemaFactory.createForClass(User).set('versionKey', false);
  