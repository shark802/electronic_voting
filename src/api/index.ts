import { Router } from "express";
import electionRouter from "./routes/election";
import authRouter from "./routes/auth";

const router = Router();

router.use(electionRouter);
router.use(authRouter);

export default router;
