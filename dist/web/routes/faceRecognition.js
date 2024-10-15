"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faceRecognition_1 = require("../controllers/faceRecognition");
const router = (0, express_1.Router)();
router.get('/register-face', faceRecognition_1.faceRegisterPage);
exports.default = router;
