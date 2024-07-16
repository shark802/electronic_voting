import { Router } from "express";
import electionRouter from "./routes/election";
import authRouter from "./routes/auth";
import candidateRouter from "./routes/candidate";

const router = Router();

router.use(electionRouter);
router.use(authRouter);
router.use(candidateRouter);

export default router;
