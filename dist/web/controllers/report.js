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
            const currentYear = new Date().getFullYear();
            const sqlSectionResult = program ? yield (0, query_1.selectQuery)(database_1.pool, 'SELECT DISTINCT section FROM users WHERE course = ? AND (year_active = ? OR is_active = 1) ORDER BY section', [program, currentYear]) : [];
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
            const currentYear = new Date().getFullYear();
            const sqlSectionResult = program ? yield (0, query_1.selectQuery)(database_1.pool, 'SELECT DISTINCT section FROM users WHERE course = ? AND (year_active = ? OR is_active = 1) ORDER BY section', [program, currentYear]) : [];
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
            const currentYear = new Date().getFullYear();
            const sqlSectionResult = program ? yield (0, query_1.selectQuery)(database_1.pool, 'SELECT DISTINCT section FROM users WHERE course = ? AND (year_active = ? OR is_active = 1) ORDER BY section', [program, currentYear]) : [];
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