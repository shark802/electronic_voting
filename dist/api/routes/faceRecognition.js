"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faceRecognition_1 = require("../controllers/faceRecognition");
const router = (0, express_1.Router)();
router.get('/face-service-domain', faceRecognition_1.getFaceRecognitionServiceDomain);
exports.default = router;
