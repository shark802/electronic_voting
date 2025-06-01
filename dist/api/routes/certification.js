"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certification_1 = require("../controllers/certification");
const router = (0, express_1.Router)();
router.post("/", certification_1.updateCertificationDetails);
exports.default = router;
