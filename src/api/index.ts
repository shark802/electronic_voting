import { Router } from "express";
import electionRouter from "./routes/election";
import authRouter from "./routes/auth";
import candidateRouter from "./routes/candidate";
import voteRouter from "./routes/vote";
import registerDeviceRouter from "./routes/registerDevice";
import populationRouter from "./routes/population";

const router = Router();

router.use(electionRouter);
router.use(authRouter);
router.use(candidateRouter);
router.use(voteRouter);
router.use(registerDeviceRouter);
router.use(populationRouter);

export default router;
