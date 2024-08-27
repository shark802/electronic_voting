"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const election_1 = require("../controllers/election");
const router = (0, express_1.Router)();
router
    .route("/elections")
    .post(election_1.createElection);
router
    .route("/elections/:id")
    .get(election_1.findElectionByID)
    .delete(election_1.deleteElection)
    .put(election_1.updateElection)
    .patch(election_1.updateElectionStatus);
router.put('/election-overview/:id', election_1.closeElectionDashboard);
router.get('/election-population', election_1.getElectionPopulation);
router.get('/election-voted', election_1.getNumberOfVoted);
router.get('/program-population', election_1.getTotalPopulationByProgram);
exports.default = router;
