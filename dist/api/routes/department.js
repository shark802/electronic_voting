"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const department_1 = require("../controllers/department");
const router = (0, express_1.Router)();
router.get('/department', department_1.getDepartmentObject);
exports.default = router;
