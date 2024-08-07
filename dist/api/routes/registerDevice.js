"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registerDevice_1 = require("../controllers/registerDevice");
const router = (0, express_1.Router)();
router.post('/uuid', registerDevice_1.requestUuidFunction);
exports.default = router;
