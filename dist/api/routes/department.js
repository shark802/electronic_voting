"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const department_1 = require("../controllers/department");
const router = (0, express_1.Router)();
router.get('/department', department_1.getDepartmentObject);
router.get('/program', department_1.getDepartmentPrograms);
router.get('/section', department_1.getProgramSection);
exports.default = router;
