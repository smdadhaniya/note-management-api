import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.model<IUser>("User", UserSchema);
