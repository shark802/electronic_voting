import { Router } from "express";
import electionRouter from "./routes/election";
import authRouter from "./routes/auth";
import candidateRouter from "./routes/candidate";
import voteRouter from "./routes/vote";
import registerDeviceRouter from "./routes/registerDevice";
import populationRouter from "./routes/population";
import userRouter from "./routes/user";

const router = Router();

router.use(electionRouter);
router.use(authRouter);
router.use(candidateRouter);
router.use(voteRouter);
router.use(registerDeviceRouter);
router.use(populationRouter);
router.use(userRouter);

export default router;
