import { Router } from "express";
import { createElection, deleteElection, findElectionByID, updateElection } from "../controllers/election";

const router = Router();

router
	.route("/elections")
	.get(findElectionByID)
	.post(createElection);

router
	.route("/elections/:id")
	.delete(deleteElection)
	.put(updateElection);

export default router;
