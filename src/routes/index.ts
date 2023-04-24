import express from "express";
import loginRouter from "./login";
import registerRouter from "./register";
import authMiddleware from "../middleware/auth";
const router = express.Router();

router.use("/login", loginRouter);
router.use("/register", registerRouter);

router.use("/", authMiddleware);

export default router;
