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
            console.log(DEPARTMENT);
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
            console.log(programId);
            const sqlRemoveProgram = yield (0, query_1.updateQuery)(database_1.pool, 'UPDATE programs SET deleted_at = ? WHERE program_id = ?', [new Date(), programId]);
            console.log(sqlRemoveProgram);
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