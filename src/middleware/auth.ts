import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface jwtPayload extends JwtPayload {
  playerId?: string;
  userId?: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const decoded: jwtPayload = <JwtPayload>(
        jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET)
      );
      if (decoded) {
        req.user = {
          playerId: decoded.playerId,
          userId: decoded.userId,
        };
        return next();
      }
    }
    throw res.status(500).json({ msg: "token missing" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

export default authMiddleware;
