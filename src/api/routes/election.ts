import { Router } from "express";
import { closeElectionDashboard, createElection, deleteElection, findElectionByID, getElectionPopulation, getNumberOfVoted, updateElection, updateElectionStatus } from "../controllers/election";

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

router.put('/election-overview/:id', closeElectionDashboard);
router.get('/election-population', getElectionPopulation);
router.get('/election-voted', getNumberOfVoted);

export default router;
