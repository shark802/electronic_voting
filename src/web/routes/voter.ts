import { Router } from "express";
import { electionPage, renderElectionBallot } from "../controllers/voter";

const router = Router();

router.get('/election', electionPage);
router.get('/ballot', renderElectionBallot)


export default router;