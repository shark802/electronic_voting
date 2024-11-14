"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const programHead_1 = require("../controllers/programHead");
const router = (0, express_1.Router)();
router.get('/dashboard/overview', programHead_1.programHeadDashboardOverviewPage);
router.get('/dashboard/vote-tally', programHead_1.programHeadDashboardVoteTallyPage);
exports.default = router;
