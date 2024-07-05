import { Router } from "express";
import { createElection, deleteElection, findElectionByID, updateElection, updateElectionStatus } from "../controllers/election";

const router = Router();

router
	.route("/elections")
	.post(createElection);

router
	.route("/elections/:id")
	.get(findElectionByID)
	.delete(deleteElection)
	.put(updateElection)
	.patch(updateElectionStatus)

export default router;
