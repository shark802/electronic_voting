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
exports.completeVoterParticipationReports = exports.programHeadVoterParticipationReport = exports.previewVoterParticipationReports = void 0;
const customErrors_1 = require("../../utils/customErrors");
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const voterService_1 = require("../../data_access/voterService");
const filterVotersByFilterParameter_1 = require("../../utils/filterVotersByFilterParameter");
const getPaginatedUsers_1 = require("../../utils/getPaginatedUsers");
const createVoterReportTitle_1 = require("../../utils/createVoterReportTitle");
function previewVoterParticipationReports(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const election_id = req.params.id;
            if (!election_id)
                throw new customErrors_1.BadRequestError('Missing required election id');
            // query parameters
            const page = req.query.page || 1;
            let voteStatus = req.query.voteStatus || 'voted'; // if voteStatus request query is falsy, assign default 'voted' value;
            const { department, program, year_level, section } = req.query;
            const selectedVoteStatus = voteStatus === 'voted' ? 1 : 0;
            const selectedDepartment = department === null || department === void 0 ? void 0 : department.toString();
            const selectedProgram = program === null || program === void 0 ? void 0 : program.toString();
            const selectedYearLevel = year_level === null || year_level === void 0 ? void 0 : year_level.toString();
            const selectedSection = section === null || section === void 0 ? void 0 : section.toString();
            // get available departments and map to array of department codes
            const availableDepartments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
            const departments = availableDepartments.map(department => department.department_code);
            // get programs based on selected department
            const departmentId = (_a = availableDepartments.find(department => department.department_code === selectedDepartment)) === null || _a === void 0 ? void 0 : _a.department_id;
            const programs = departmentId ? (yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM programs WHERE department = ? AND deleted_at IS NULL', [departmentId])).map(program => program.program_code) : [];
            // get year levels
            const yearLevels = [1, 2, 3, 4];
            const sqlSectionResult = program ? yield (0, query_1.selectQuery)(database_1.pool, `SELECT DISTINCT users.section
            FROM voters JOIN users ON voters.id_number = users.id_number 
            WHERE voters.election_id = ?
            AND course = ?
            ORDER BY users.section`, [election_id, program]) : [];
            const sections = sqlSectionResult.map(section => Object.values(section)).flat();
            const [election] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE election_id = ? LIMIT 1', [election_id]);
            const voters = yield (0, voterService_1.getAllVoterInElection)(election_id);
            // filter voters
            const filteredVoters = yield (0, filterVotersByFilterParameter_1.filterVotersByFilterParameter)(voters, selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection);
            const reportTitle = (0, createVoterReportTitle_1.createVoterReportTitle)(selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection);
            const users = (0, getPaginatedUsers_1.getPaginatedUsers)(filteredVoters, page);
            const usersSize = filteredVoters.length;
            res.render('report/preview-voter-report', { election, departments, programs, yearLevels, sections, selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection, users, page, usersSize, reportTitle });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.previewVoterParticipationReports = previewVoterParticipationReports;
function programHeadVoterParticipationReport(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const election_id = req.params.id;
            if (!election_id)
                throw new customErrors_1.BadRequestError('Missing required election id');
            // query parameters
            const page = req.query.page || 1;
            let voteStatus = req.query.voteStatus || 'voted'; // if voteStatus request query is falsy, assign default 'voted' value;
            const { department, program, year_level, section } = req.query;
            const selectedVoteStatus = voteStatus === 'voted' ? 1 : 0;
            const selectedDepartment = department === null || department === void 0 ? void 0 : department.toString();
            const selectedProgram = program === null || program === void 0 ? void 0 : program.toString();
            const selectedYearLevel = year_level === null || year_level === void 0 ? void 0 : year_level.toString();
            const selectedSection = section === null || section === void 0 ? void 0 : section.toString();
            // get available departments and map to array of department codes
            const availableDepartments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
            const departments = availableDepartments.map(department => department.department_code);
            // get programs based on selected department
            const departmentId = (_a = availableDepartments.find(department => department.department_code === selectedDepartment)) === null || _a === void 0 ? void 0 : _a.department_id;
            const programs = departmentId ? (yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM programs WHERE department = ? AND deleted_at IS NULL', [departmentId])).map(program => program.program_code) : [];
            // get year levels
            const yearLevels = [1, 2, 3, 4];
            const sqlSectionResult = program ? yield (0, query_1.selectQuery)(database_1.pool, `SELECT DISTINCT users.section
            FROM voters JOIN users ON voters.id_number = users.id_number 
            WHERE voters.election_id = ?
            AND course = ?
            ORDER BY users.section`, [election_id, program]) : [];
            const sections = sqlSectionResult.map(section => Object.values(section)).flat();
            const [election] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE election_id = ? LIMIT 1', [election_id]);
            const voters = yield (0, voterService_1.getAllVoterInElection)(election_id);
            // filter voters
            const filteredVoters = yield (0, filterVotersByFilterParameter_1.filterVotersByFilterParameter)(voters, selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection);
            const reportTitle = (0, createVoterReportTitle_1.createVoterReportTitle)(selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection);
            const users = (0, getPaginatedUsers_1.getPaginatedUsers)(filteredVoters, page);
            const usersSize = filteredVoters.length;
            res.render('report/program-head-voter-report', { election, departments, programs, yearLevels, sections, selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection, users, page, usersSize, reportTitle });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.programHeadVoterParticipationReport = programHeadVoterParticipationReport;
function completeVoterParticipationReports(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const election_id = req.params.id;
            if (!election_id)
                throw new customErrors_1.BadRequestError('Missing required election id');
            // query parameters
            const page = req.query.page || 1;
            let voteStatus = req.query.voteStatus || 'voted'; // if voteStatus request query is falsy, assign default 'voted' value;
            const { department, program, year_level, section } = req.query;
            const selectedVoteStatus = voteStatus === 'voted' ? 1 : 0;
            const selectedDepartment = department === null || department === void 0 ? void 0 : department.toString();
            const selectedProgram = program === null || program === void 0 ? void 0 : program.toString();
            const selectedYearLevel = year_level === null || year_level === void 0 ? void 0 : year_level.toString();
            const selectedSection = section === null || section === void 0 ? void 0 : section.toString();
            // get available departments and map to array of department codes
            const availableDepartments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
            const departments = availableDepartments.map(department => department.department_code);
            // get programs based on selected department
            const departmentId = (_a = availableDepartments.find(department => department.department_code === selectedDepartment)) === null || _a === void 0 ? void 0 : _a.department_id;
            const programs = departmentId ? (yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM programs WHERE department = ? AND deleted_at IS NULL', [departmentId])).map(program => program.program_code) : [];
            // get year levels
            const yearLevels = [1, 2, 3, 4];
            const sqlSectionResult = program ? yield (0, query_1.selectQuery)(database_1.pool, `SELECT DISTINCT users.section
            FROM voters JOIN users ON voters.id_number = users.id_number 
            WHERE voters.election_id = ?
            AND course = ?
            ORDER BY users.section`, [election_id, program]) : [];
            const sections = sqlSectionResult.map(section => Object.values(section)).flat();
            const [election] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE election_id = ? LIMIT 1', [election_id]);
            const voters = yield (0, voterService_1.getAllVoterInElection)(election_id);
            // filter voters
            const filteredVoters = yield (0, filterVotersByFilterParameter_1.filterVotersByFilterParameter)(voters, selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection);
            const reportTitle = (0, createVoterReportTitle_1.createVoterReportTitle)(selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection);
            const users = (0, getPaginatedUsers_1.getPaginatedUsers)(filteredVoters, page);
            const usersSize = filteredVoters.length;
            res.render('report/voter-complete-report', { election, departments, programs, yearLevels, sections, selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, selectedSection, users, page, usersSize, reportTitle });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.completeVoterParticipationReports = completeVoterParticipationReports;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3dlYi9jb250cm9sbGVycy9yZXBvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsMkRBQTJEO0FBQzNELG1EQUFzRDtBQUV0RCxvREFBNkM7QUFDN0MsaUVBQXVFO0FBR3ZFLDZGQUEwRjtBQUMxRixxRUFBa0U7QUFDbEUsK0VBQTRFO0FBSTVFLFNBQXNCLGdDQUFnQyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7OztRQUNsRyxJQUFJLENBQUM7WUFDRCxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUMsV0FBVztnQkFBRSxNQUFNLElBQUksOEJBQWUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1lBRTVFLG1CQUFtQjtZQUNuQixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUE7WUFDaEMsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLENBQUMsc0VBQXNFO1lBQ3hILE1BQU0sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBRS9ELE1BQU0sa0JBQWtCLEdBQUcsVUFBVSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUQsTUFBTSxrQkFBa0IsR0FBRyxVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsUUFBUSxFQUFFLENBQUM7WUFDbEQsTUFBTSxlQUFlLEdBQUcsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFFBQVEsRUFBRSxDQUFDO1lBQzVDLE1BQU0saUJBQWlCLEdBQUcsVUFBVSxhQUFWLFVBQVUsdUJBQVYs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