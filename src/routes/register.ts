import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../db/models/User";
import Player, { IPlayer } from "../db/models/Players";
import { jwtPayload } from "../middleware/auth";
import Inventory, { IInventory } from "../db/models/Inventory";

const registerRouter = express.Router();

registerRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const existingUser: IUser | null = await User.findOne({ email });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 12);

        if (hashedPassword) {
          const newInventory: IInventory = await Inventory.create({});

          if (newInventory) {
            const newPlayer: IPlayer = await Player.create({
              pic: 0,
              inventory: newInventory._id,
            });

            if (newPlayer) {
              const newUser: IUser = await User.create({
                email,
                password: hashedPassword,
                player: newPlayer._id,
              });

              if (newUser) {
                const payload: jwtPayload = {
                  playerId: newPlayer._id,
                  userId: newUser._id,
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                  expiresIn: "1h",
                });

                if (token) {
                  return res.status(200).json({ token });
                }
              }
            }
          }
        }
      } else {
        throw "User already exists.";
      }
    }
    throw "Something went wrong!";
  } catch (error) {
    return res.status(401).json({ message: "Login failed. " + error });
  }
});

export default registerRouter;
