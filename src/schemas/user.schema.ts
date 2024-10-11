import mongoose, { Document } from "mongoose";
import { IUser } from "src/interface/user.interface";
const { Schema, model } = mongoose;

export const UserSchema = new Schema<IUser>({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
});

export const User = model<IUser>('User', UserSchema);
