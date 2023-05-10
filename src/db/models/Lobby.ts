import mongoose, { Schema, Document } from "mongoose";
import { IPlayer } from "./Players";
import { IInventory } from "./Inventory";

export interface ILobby extends Document {
  name: string;
  players: IPlayer["_id"][];
  playerInventory: [
    {
      playerId: IPlayer["_id"];
      inventory: IInventory["_id"];
    }
  ];
  host: IPlayer;
  progress: {
    season: number;
    episode: number;
    level: number;
  };
}

const LobbySchema: Schema<ILobby> = new Schema({
  name: { type: String, required: true, unique: true },
  players: [{ type: Schema.Types.ObjectId, ref: "Player" }],
  playerInventory: [
    {
      playerId: { type: Schema.Types.ObjectId, ref: "Player" },
      inventory: { type: Schema.Types.ObjectId, ref: "Inventory" },
    },
  ],
  host: { type: Schema.Types.ObjectId, ref: "Player" },
  progress: {
    season: { type: Number },
    episode: { type: Number },
    level: { type: Number },
  },
});

export default mongoose.model<ILobby>("Lobby", LobbySchema);
