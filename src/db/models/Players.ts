import mongoose, { Schema, Document } from "mongoose";
import { ILobby } from "./Lobby";
import { IInventory } from "./Inventory";

export interface IPlayer extends Document {
  name?: string;
  pic?: number;
  friends?: IPlayer["_id"][];
  friendRequestsSent?: IPlayer["_id"][];
  friendRequests?: IPlayer["_id"][];
  lobby?: ILobby["_id"][];
  joinedLobby?: ILobby["_id"][];
  inventory?: IInventory["_id"];
  profileId?: string;
}

const PlayerSchema: Schema<IPlayer> = new Schema({
  name: { type: String },
  pic: { type: Number },
  friends: [{ type: Schema.Types.ObjectId, ref: "Player" }],
  friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: "Player" }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: "Player" }],
  lobby: [{ type: Schema.Types.ObjectId, ref: "Lobby" }],
  joinedLobby: [{ type: Schema.Types.ObjectId, ref: "Lobby" }],
  inventory: [{ type: Schema.Types.ObjectId, ref: "Inventory" }],
  profileId: { type: String, unique: true },
});

export default mongoose.model<IPlayer>("Player", PlayerSchema);
