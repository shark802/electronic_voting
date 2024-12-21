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
exports.getAllYearLevel = exports.removeProgram = exports.getAllPrograms = exports.addProgram = exports.setDepartmentMaxSenatorVote = exports.removeDepartment = exports.getProgramSection = exports.getDepartmentPrograms = exports.getDepartmentObject = exports.getAllDepartments = exports.addDepartment = void 0;
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const customErrors_1 = require("../../utils/customErrors");
function addDepartment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { departmentCode } = req.body;
            if (!departmentCode || departmentCode === "")
                throw new customErrors_1.BadRequestError("Department code is required");
            const department = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE department_code = ? AND deleted_at IS NULL', [departmentCode]);
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
            const departments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
            const programs = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM programs WHERE deleted_at IS NULL');
            const DEPARTMENT = {};
            for (const department of departments) {
                DEPARTMENT[department.department_code] = programs.filter(program => program.department === department.department_id).map(program => program.program_code);
            }
            return res.status(200).json({ DEPARTMENT });
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
            const departmentCode = req.query.department;
            const [department] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT department_id FROM departments WHERE department_code = ? AND deleted_at IS NULL', [departmentCode]);
            if (!department)
                throw new customErrors_1.NotFoundError(`Department ${departmentCode} not found`);
            const programs = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT program_code FROM programs WHERE department = ? AND deleted_at IS NULL', [department.department_id]);
            const programCodes = programs.map(program => program.program_code);
            return res.status(200).json({ programs: programCodes });
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
            const sections = sqlSectionResult.map(section => section.section);
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
            const departmentId = req.params.id;
            if (!departmentId || departmentId === "")
                throw new customErrors_1.BadRequestError("Department code is required");
            const sqlRemoveDepartment = yield (0, query_1.updateQuery)(database_1.pool, 'UPDATE departments SET deleted_at = ? WHERE department_id = ?', [new Date(), departmentId]);
            if (sqlRemoveDepartment.affectedRows === 0)
                throw new customErrors_1.NotFoundError(`Department ${departmentId} not found`);
            yield (0, query_1.updateQuery)(database_1.pool, 'UPDATE programs SET deleted_at = ? WHERE department = ?', [new Date(), departmentId]);
            return res.status(200).json({ message: "Department removed successfully" });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.removeDepartment = removeDepartment;
function setDepartmentMaxSenatorVote(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { departmentId, maxVote } = req.body;
            if (!departmentId)
                throw new customErrors_1.BadRequestError("Department is required");
            if (!maxVote)
                throw new customErrors_1.BadRequestError("Max vote is required");
            const sqlSetDepartmentMaxSenatorVote = yield (0, query_1.updateQuery)(database_1.pool, 'UPDATE departments SET max_select_senator = ? WHERE department_id = ?', [maxVote, departmentId]);
            if (sqlSetDepartmentMaxSenatorVote.affectedRows === 0)
                throw new customErrors_1.NotFoundError(`Department ${departmentId} not found`);
            return res.status(200).json({ message: "Department max senator vote set successfully" });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.setDepartmentMaxSenatorVote = setDepartmentMaxSenatorVote;
function addProgram(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { departmentId, programCode } = req.body;
            if (!departmentId)
                throw new customErrors_1.BadRequestError("Department is required");
            if (!programCode)
                throw new customErrors_1.BadRequestError("Program code is required");
            const existingProgram = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM programs WHERE program_code = ? AND deleted_at IS NULL', [programCode]);
            if (existingProgram.length > 0)
                throw new customErrors_1.ConflictError(`${programCode} already exists`);
            yield (0, query_1.insertQuery)(database_1.pool, 'INSERT INTO programs (department, program_code) VALUES (?, ?)', [departmentId, programCode]);
            return res.status(200).json({ message: "Program added successfully" });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.addProgram = addProgram;
function getAllPrograms(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const programs = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM programs p JOIN departments d ON p.department = d.department_id WHERE p.deleted_at IS NULL ORDER BY d.department_code, p.program_code');
            return res.status(200).json({ programs });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getAllPrograms = getAllPrograms;
function removeProgram(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const programId = req.params.id;
            const sqlRemoveProgram = yield (0, query_1.updateQuery)(database_1.pool, 'UPDATE programs SET deleted_at = ? WHERE program_id = ?', [new Date(), programId]);
            if (sqlRemoveProgram.affectedRows === 0)
                throw new customErrors_1.NotFoundError(`Program ${programId} not found`);
            return res.status(200).json({ message: "Program removed successfully" });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.removeProgram = removeProgram;
function getAllYearLevel(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let yearLevelsResult = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT DISTINCT year_level FROM users');
            const yearLevels = yearLevelsResult.map(level => level.year_level).sort();
            return res.status(200).json({ yearLevels });
        }
        catch (error) {
        }
    });
}
exports.getAllYearLevel = getAllYearLevel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwYXJ0bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvZGVwYXJ0bWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSxtREFBZ0Y7QUFDaEYsb0RBQTZDO0FBRzdDLDJEQUF5RjtBQUd6RixTQUFzQixhQUFhLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7UUFDL0UsSUFBSSxDQUFDO1lBQ0QsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFFcEMsSUFBSSxDQUFDLGNBQWMsSUFBSSxjQUFjLEtBQUssRUFBRTtnQkFBRSxNQUFNLElBQUksOEJBQWUsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBRXZHLE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFhLGVBQUksRUFBRSw0RUFBNEUsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDdkosSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQUUsTUFBTSxJQUFJLDRCQUFhLENBQUMsR0FBRyxjQUFjLGlCQUFpQixDQUFDLENBQUM7WUFFdkYsTUFBTSxJQUFBLG1CQUFXLEVBQUMsZUFBSSxFQUFFLHNEQUFzRCxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNsRyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLCtCQUErQixFQUFFLENBQUMsQ0FBQTtRQUU3RSxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNmLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFmRCxzQ0FlQztBQUVELFNBQXNCLGlCQUFpQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQ25GLElBQUksQ0FBQztZQUNE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