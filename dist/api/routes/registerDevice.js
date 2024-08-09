"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registerDevice_1 = require("../controllers/registerDevice");
const router = (0, express_1.Router)();
router.route('/uuid')
    .post(registerDevice_1.requestUuidFunction)
    .put(registerDevice_1.acceptRequestFunction);
router.route('/uuid/:id')
    .delete(registerDevice_1.declineRequestFunction);
exports.default = router;
