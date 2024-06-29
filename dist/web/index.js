"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generalAccess_1 = __importDefault(require("./routes/generalAccess"));
const admin_1 = __importDefault(require("./routes/admin"));
const router = (0, express_1.Router)();
router.use(generalAccess_1.default);
router.use("/admin", admin_1.default);
exports.default = router;
