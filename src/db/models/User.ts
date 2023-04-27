import mongoose, { Schema, Document } from "mongoose";
import { IPlayer } from "./Players";

export interface IUser extends Document {
  email: string;
  password: string;
  player: IPlayer["_id"];
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  player: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
