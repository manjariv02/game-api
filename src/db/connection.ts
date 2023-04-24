import mongoose from "mongoose";
import fs from "fs";
import { Express } from "express";
import path from "path";

const connectDB = (app: Express) => {
  const connectionURL = process.env.MONGODB_URL;

  mongoose
    .connect(`${connectionURL}`)
    .then(() => {
      app.emit("dbConnected");
    })
    .catch((err) => {
      console.log("DB connection error: " + err);
    });
};

export default connectDB;
