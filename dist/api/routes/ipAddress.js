"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ipAddress_1 = require("../controllers/ipAddress");
const router = (0, express_1.Router)();
router.route('/ip-address')
    .post(ipAddress_1.addIpAddress)
    .get(ipAddress_1.getIpAddress);
router.route('/ip-address/all')
    .get(ipAddress_1.getAllIpAddress);
exports.default = router;
