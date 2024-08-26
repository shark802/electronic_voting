"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const program_head_1 = require("../controllers/program-head");
const router = (0, express_1.default)();
router.get('/dashboard/overview', program_head_1.programHeadDasboardOverviewPage);
router.get('/dashboard/vote-tally', program_head_1.programHeadDasboardVoteTallyPage);
exports.default = router;
