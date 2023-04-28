import mongoose, { Schema, Document } from "mongoose";
import { ILobby } from "./Lobby";
import { IInventory } from "./Inventory";

export interface IPlayer extends Document {
  name?: string;
  pic?: string;
  friends?: IPlayer["_id"][];
  friendRequests?: IPlayer["_id"][];
  lobby?: ILobby["_id"][];
  inventory?: IInventory["_id"];
}

const PlayerSchema: Schema<IPlayer> = new Schema({
  name: { type: String },
  pic: { type: String },
  friends: [{ type: Schema.Types.ObjectId, ref: "Player" }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: "Player" }],
  lobby: [{ type: Schema.Types.ObjectId, ref: "Lobby" }],
  inventory: [{ type: Schema.Types.ObjectId, ref: "Inventory" }],
});

export default mongoose.model<IPlayer>("Player", PlayerSchema);
