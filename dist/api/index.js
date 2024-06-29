"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const election_1 = __importDefault(require("./routes/election"));
const router = (0, express_1.Router)();
router.use(election_1.default);
exports.default = router;
