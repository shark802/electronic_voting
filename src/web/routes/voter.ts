import { Router } from "express";
import { electionPage, renderElectionBallot } from "../controllers/voter";
import { isAuthenticated, isValidVoter } from "../../middlewares/authorization";

const router = Router();

router.use(isAuthenticated);

router.get('/election', electionPage);

router.use(isValidVoter)

router.get('/ballot/:electionId', renderElectionBallot)


export default router;