import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../db/models/User";
import Player, { IPlayer } from "../db/models/Players";

const loginRouter = express.Router();

loginRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const existingUser: IUser | null = await User.findOne({ email });

      if (existingUser) {
        const isPasswordCorrect: boolean = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (isPasswordCorrect) {
          const payload = {
            playerId: existingUser.player,
            userId: existingUser._id,
          };
          const token = jwt.sign(payload, "secret", { expiresIn: "3d" });

          if (token) return res.status(200).json({ token });
        }
      }
    }
    throw "Something went wrong!";
  } catch (error) {
    return res.status(401).json({ message: "Login failed. " + error });
  }
});

export default loginRouter;
