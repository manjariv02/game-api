import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../db/models/User";

const registerRouter = express.Router();

registerRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const existingUser: IUser | null = await User.findOne({ email });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 12);

        if (hashedPassword) {
          const newUser: IUser = await User.create({
            email,
            password: hashedPassword,
          });

          if (newUser) {
            const token = jwt.sign(
              { email: newUser.email, id: newUser._id },
              "secret",
              {
                expiresIn: "1h",
              }
            );
            if (token) {
              return res.status(200).json({ token });
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

// registerRouter.post("/", async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     if (email && password) {
//       const existingUser: IUser | null = await User.findOne({ email });

//       if (!existingUser) {
//         const hashedPassword = await bcrypt.hash(password, 12);

//         if (hashedPassword) {
//           const newUser: IUser = new User({
//             email,
//             password: hashedPassword,
//           });

//           if (newUser) {
//             const result = await newUser.save();
//             if (result) {
//               const token = jwt.sign(
//                 { email: result.email, id: result._id },
//                 "secret",
//                 {
//                   expiresIn: "1h",
//                 }
//               );
//               if (token) {
//                 return res.status(200).json({ result, token });
//               }
//             }
//           }
//         }
//       }
//     }
//     throw "Something went wrong!";
//   } catch (error) {
//     return res.status(401).json({ message: "Login failed. " + error });
//   }
// });
