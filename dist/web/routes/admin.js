"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../controllers/admin");
const router = (0, express_1.Router)();
// Dashboard
router.get("/dashboard/overview", admin_1.dashboardOverview);
router.get("/dashboard/vote-tally", admin_1.dashboardVoteTally);
// Elections
router.get("/election/view", admin_1.viewElection);
router.get("/election/new", admin_1.newElection);
// Candidate
router.get("/candidate/manage", admin_1.manageCandidate);
router.get("/candidate/new", admin_1.addCandidate);
// Voter
router.get("/voter/manage", admin_1.manageVoter);
//Register Device
router.get("/register-device/request", admin_1.reviewRegisterDevice);
router.get("/register-device/registered", admin_1.viewRegisterDevice);
// Control Panel
router.get("/control-panel/import-user", admin_1.fetchUser);
exports.default = router;
