import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const isProtected = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) return res.send(401).send({ msg: "token missing" });
  try {
    let decoded: any = jwt.verify(authorization.split(" ")[1], "secret");
    next();
  } catch (error) {
    res.send(401).send({ msg: error });
  }
};

export default isProtected;
