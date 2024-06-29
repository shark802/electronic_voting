"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const election_1 = require("../controllers/election");
const router = (0, express_1.Router)();
router
    .route("/elections")
    .get(election_1.findElectionByID)
    .post(election_1.createElection);
router
    .route("/elections/:id")
    .delete(election_1.deleteElection)
    .put(election_1.updateElection);
exports.default = router;
