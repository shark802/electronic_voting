"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgramSection = exports.getDepartmentPrograms = exports.getDepartmentObject = void 0;
const BccDepartments_1 = require("../../config/constants/BccDepartments");
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
function getDepartmentObject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return res.status(200).json({ DEPARTMENT: BccDepartments_1.DEPARTMENT });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getDepartmentObject = getDepartmentObject;
function getDepartmentPrograms(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const department = req.query.department;
            const programs = Object.values(BccDepartments_1.DEPARTMENT[department]);
            return res.status(200).json({ programs });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getDepartmentPrograms = getDepartmentPrograms;
function getProgramSection(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const program = req.query.program;
            const currentYear = new Date().getFullYear();
            const sqlSectionResult = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT DISTINCT section FROM users WHERE course = ? AND (year_active = ? OR is_active = 1) ORDER BY section', [program, currentYear]);
            const sections = sqlSectionResult.map(section => Object.values(section)).flat();
            return res.status(200).json({ sections });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getProgramSection = getProgramSection;
