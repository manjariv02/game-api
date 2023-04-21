import express from "express";
import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import mongoose from "mongoose";
import authRouter from "./authentication/auth.controller";

const db = process.env.MONGODB_URL;
const app = express();

app.use(bodyParser.json());
app.use("/auth", authRouter);
mongoose
  .connect(`${db}`)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((error) => {
    console.log("dfss", error.message);
  });
