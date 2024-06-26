import { Router } from "express";
import electionRouter from "./routes/election";

const router = Router();

router.use(electionRouter);

export default router;
