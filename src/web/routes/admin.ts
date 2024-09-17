import { Router } from "express"
import {
    dashboardOverview,
    dashboardVoteTally,
    newElection,
    viewElection,
    manageCandidate,
    addCandidate,
    manageVoter,
    reviewRegisterDevice,
    viewRegisterDevice,
    fetchUser,
    editElection,
    viewElectionHistory,
    renderAdminElectionResult
} from '../controllers/admin';

const router = Router();

// Dashboard
router.get("/dashboard/overview", dashboardOverview);
router.get("/dashboard/vote-tally", dashboardVoteTally);

// Elections
router.get("/election/view", viewElection);
router.get("/election/new", newElection);
router.get("/election/:id/edit", editElection);
router.get("/election/history", viewElectionHistory);
router.get("/election/result/:id", renderAdminElectionResult);

// Candidate
router.get("/candidate/manage", manageCandidate);
router.get("/candidate/new", addCandidate);

// Voter
router.get("/voter/manage", manageVoter);

//Register Device
router.get("/register-device/request", reviewRegisterDevice);
router.get("/register-device/registered", viewRegisterDevice);

// Control Panel
router.get("/control-panel/user", fetchUser);

export default router