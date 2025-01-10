import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLE } from 'src/constants/contants';
import { BaseSchema } from 'src/shared/base.schema';
import { UsersAddress, UsersAddressSchema } from './user-address.schema';

export type UserDocument = User & Document;

/**
 * Esquema de Usuario
 * @prop {string} session_id - Identificador de la sesion
 * @prop {string} username - Nombre de usuario
 * @prop {string} password - Contraseña del usuario
 * @prop {string} email - Correo electronico del usuario
 * @prop {boolean} is_verified - Indica si el usuario esta verificado
 * @prop {string} role - Rol del usuario
 * @prop {string} otp - Codigo OTP de verificacion
 * @prop {Date} otp_expiration - Fecha de expiracion del codigo OTP
 * @prop {string[]} permissions - Permisos del usuario
 * @prop {Date} create_date - Fecha de creacion del usuario
 * @prop {Date} update_date - Fecha de actualizacion del usuario
 */
@Schema()
export class User extends BaseSchema {
  @Prop({ required: false, type: String, default: ''})
  sessionId?: string;

  @Prop({ required: true, type: String, unique: true, minlength: 5 })
  username: string;

  @Prop({ required: true, type: String, minlength: 8 })
  password: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String })
  phone: string

  @Prop({ required: false, type: UsersAddressSchema })
  address: UsersAddress

  @Prop({ required: false, type: Boolean, default: false })
  isVerified?: boolean;

  @Prop({ required: false, type: String, default: ROLE.USER, enum: Object.values(ROLE) })
  role?: ROLE

  @Prop({ required: false, type: Boolean, default: false })
  isBlocked?: boolean;

  @Prop({ require: false, type: Date, default: null})
  blockExpiresAt?: Date;

  @Prop({ required: false, type: Array, default: [] })
  permissions?: string[];

}

export const UserSchema = SchemaFactory.createForClass(User).set('versionKey', false);


  