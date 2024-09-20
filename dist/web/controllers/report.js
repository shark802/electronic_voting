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
exports.previewVoterParticipationReports = void 0;
const customErrors_1 = require("../../utils/customErrors");
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const BccDepartments_1 = require("../../config/constants/BccDepartments");
const voterService_1 = require("../../data_access/voterService");
const filterVotersByFilterParameter_1 = require("../../utils/filterVotersByFilterParameter");
const getPaginatedUsers_1 = require("../../utils/getPaginatedUsers");
function previewVoterParticipationReports(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const election_id = req.params.id;
            if (!election_id)
                throw new customErrors_1.BadRequestError('Missing required election id');
            // query parameters
            const page = req.query.page || 1;
            let voteStatus = req.query.voteStatus || 'voted'; // if voteStatus request query is falsy, assign default 'voted' value;
            const { department, program, year_level } = req.query;
            const selectedVoteStatus = voteStatus === 'voted' ? 1 : 0;
            const selectedDepartment = department === null || department === void 0 ? void 0 : department.toString();
            const selectedProgram = program === null || program === void 0 ? void 0 : program.toString();
            const selectedYearLevel = year_level === null || year_level === void 0 ? void 0 : year_level.toString();
            const departments = Object.keys(BccDepartments_1.DEPARTMENT);
            const programs = department ? Object.values(BccDepartments_1.DEPARTMENT[department]) : [];
            const yearLevels = [1, 2, 3, 4];
            const [election] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE election_id = ? LIMIT 1', [election_id]);
            const voters = yield (0, voterService_1.getAllVoterInElection)(election_id);
            // filter voters
            const filteredVoters = (0, filterVotersByFilterParameter_1.filterVotersByFilterParameter)(voters, selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel);
            const users = (0, getPaginatedUsers_1.getPaginatedUsers)(filteredVoters, page);
            const usersSize = filteredVoters.length;
            res.render('report/preview-voter-report', { election, departments, programs, yearLevels, selectedVoteStatus, selectedDepartment, selectedProgram, selectedYearLevel, users, page, usersSize });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.previewVoterParticipationReports = previewVoterParticipationReports;
