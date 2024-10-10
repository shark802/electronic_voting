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
exports.removeDepartment = exports.getProgramSection = exports.getDepartmentPrograms = exports.getDepartmentObject = exports.getAllDepartments = exports.addDepartment = void 0;
const BccDepartments_1 = require("../../config/constants/BccDepartments");
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const customErrors_1 = require("../../utils/customErrors");
function addDepartment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { departmentCode } = req.body;
            if (!departmentCode || departmentCode === "")
                throw new customErrors_1.BadRequestError("Department code is required");
            const department = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE department_code = ?', [departmentCode]);
            if (department.length > 0)
                throw new customErrors_1.ConflictError(`${departmentCode} already exists`);
            yield (0, query_1.insertQuery)(database_1.pool, 'INSERT INTO departments (department_code) VALUES (?)', [departmentCode]);
            return res.status(200).json({ message: "Department added successfully" });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.addDepartment = addDepartment;
function getAllDepartments(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const departments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
            return res.status(200).json({ departments });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getAllDepartments = getAllDepartments;
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
function removeDepartment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const department = req.params.departmentCode;
            if (!department || department === "")
                throw new customErrors_1.BadRequestError("Department code is required");
            const sqlRemoveDepartment = yield (0, query_1.updateQuery)(database_1.pool, 'UPDATE departments SET deleted_at = ? WHERE department_code = ?', [new Date(), department]);
            if (sqlRemoveDepartment.affectedRows === 0)
                throw new customErrors_1.NotFoundError(`Department ${department} not found`);
            return res.status(200).json({ message: "Department removed successfully" });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.removeDepartment = removeDepartment;
