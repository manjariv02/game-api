import mongoose, { Schema, Document } from "mongoose";

export interface IInventory extends Document {
  normalArr: number;
  fireArr: number;
}

const InventorySchema: Schema<IInventory> = new Schema({
  normalArr: { type: Number, default: 0 },
  fireArr: { type: Number, default: 0 },
});

export default mongoose.model<IInventory>("Inventory", InventorySchema);
