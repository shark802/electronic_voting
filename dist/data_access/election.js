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
exports.getAllCompleteElection = exports.getDepartmentsTotalVotes = exports.getDepartmentsTotalPopulation = exports.totalUserVotedPerElection = exports.getAllCandidatesInElection = exports.getCandidatesTotalTally = exports.getElectionInfoById = void 0;
const database_1 = require("../config/database");
const query_1 = require("./query");
function getElectionInfoById(electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const [election] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE election_id = ? AND deleted_at IS NULL', [electionId]);
        return election;
    });
}
exports.getElectionInfoById = getElectionInfoById;
function getCandidatesTotalTally(electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sqlQuery = `
        SELECT c.position, c.party, c.department, MAX(c.candidate_profile) AS candidate_profile, u.id_number, u.lastname, u.firstname, u.course, v.election_id, COUNT(v.candidate_id) AS vote_count
        FROM candidates c
        LEFT JOIN votes v ON c.id_number = v.candidate_id AND v.election_id = c.election_id
        LEFT JOIN users u ON u.id_number = c.id_number     
        WHERE c.election_id = ? AND c.deleted IS NULL 
        GROUP BY c.position, u.id_number, u.lastname, u.firstname, u.course, v.election_id, c.party, c.department
        ORDER BY vote_count DESC;
    `;
        const candidatesVoteTally = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [electionId]);
        return candidatesVoteTally;
    });
}
exports.getCandidatesTotalTally = getCandidatesTotalTally;
function getAllCandidatesInElection(electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sqlQuery = `
        SELECT u.id_number, u.firstname, u.lastname, u.course, c.position
        FROM users u
        JOIN candidates c ON u.id_number = c.id_number
        WHERE election_id = ? AND c.deleted IS NULL AND c.enabled = 1
    `;
        const candidates = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [electionId]); // Assuming selectQuery automatically binds parameters
        return candidates;
    });
}
exports.getAllCandidatesInElection = getAllCandidatesInElection;
function totalUserVotedPerElection() {
    return __awaiter(this, void 0, void 0, function* () {
        const sqlQuery = `
        SELECT e.election_id, COUNT(DISTINCT v.voter_id) AS total_voted
        FROM elections e
        JOIN votes v ON e.election_id = v.election_id
        WHERE e.is_close = 0
        GROUP BY e.election_id;
    `;
        const totalVoted = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery);
        return totalVoted;
    });
}
exports.totalUserVotedPerElection = totalUserVotedPerElection;
function getDepartmentsTotalPopulation(electionIdArray) {
    return __awaiter(this, void 0, void 0, function* () {
        const departments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
        const electionDepartmentTotalPopulation = []; // will accumulate all elections vote summary per department
        for (const electionId of electionIdArray) {
            const departmentTotalPopulation = {
                election_id: electionId,
                department_total_population: {}
            };
            for (const department of departments) {
                const [result] = yield (0, query_1.selectQuery)(database_1.pool, `SELECT * FROM program_populations WHERE election_id = ? AND program_code = ?`, [electionId, department.department_code]);
                departmentTotalPopulation.department_total_population[department.department_code] = (result ? result.program_population : 0);
            }
            electionDepartmentTotalPopulation.push(departmentTotalPopulation);
        }
        return electionDepartmentTotalPopulation;
    });
}
exports.getDepartmentsTotalPopulation = getDepartmentsTotalPopulation;
function getDepartmentsTotalVotes(electionIdArray) {
    return __awaiter(this, void 0, void 0, function* () {
        const departments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
        const programs = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM programs WHERE deleted_at IS NULL');
        const sqlQuery = `
        SELECT COUNT(DISTINCT v.voter_id) as total_voted, v.election_id
        FROM votes v
        LEFT JOIN users u
        ON v.voter_id = u.id_number
        WHERE u.course IN (?) AND v.election_id = ?
        GROUP BY v.election_id
    `;
        const departmentVotesSummary = []; // will accumulate all elections vote summary per department
        for (const electionId of electionIdArray) {
            const electionDepartmentVoteSummary = {
                election_id: electionId,
                department_votes: {} // Initialized as an empty object with correct type
            };
            for (const department of departments) {
                const programList = programs.filter(program => program.department === department.department_id).map(program => program.program_code);
                if (programList.length === 0) {
                    electionDepartmentVoteSummary.department_votes[department.department_code] = 0;
                }
                else {
                    const [result] = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [programList, electionId]);
                    // Cast departmentCode to DepartmentCode type
                    electionDepartmentVoteSummary.department_votes[department.department_code] = result ? result.total_voted : 0;
                }
            }
            departmentVotesSummary.push(electionDepartmentVoteSummary);
        }
        return departmentVotesSummary;
    });
}
exports.getDepartmentsTotalVotes = getDepartmentsTotalVotes;
function getAllCompleteElection() {
    return __awaiter(this, void 0, void 0, function* () {
        const selectSqlQuery = 'SELECT * FROM elections WHERE (date_end < CURDATE() OR (date_end = CURDATE() AND time_end < CURTIME())) AND deleted_at IS NULL ORDER BY date_end DESC, time_end DESC';
        const elections = yield (0, query_1.selectQuery)(database_1.pool, selectSqlQuery);
        return elections;
    });
}
exports.getAllCompleteElection = getAllCompleteElection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGF0YV9hY2Nlc3MvZWxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsaURBQTBDO0FBRTFDLG1DQUFzQztBQUt0QyxTQUFzQixtQkFBbUIsQ0FBQyxVQUFrQjs7UUFDeEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFXLGVBQUksRUFBRSxzRUFBc0UsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDM0ksT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztDQUFBO0FBSEQsa0RBR0M7QUFFRCxTQUFzQix1QkFBdUIsQ0FBQyxVQUFrQjs7UUFFNUQsTUFBTSxRQUFRLEdBQUc7Ozs7Ozs7O0tBUWhCLENBQUE7UUFDRCxNQUFNLG1CQUFtQixHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFDLGVBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzVFLE9BQU8sbUJBQW1CLENBQUM7SUFDL0IsQ0FBQztDQUFBO0FBYkQsMERBYUM7QUFFRCxTQUFzQiwwQkFBMEIsQ0FBQyxVQUFrQjs7UUFDL0QsTUFBTSxRQUFRLEdBQUc7Ozs7O0tBS2hCLENBQUE7UUFFRCxNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBQyxlQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLHNEQUFzRDtRQUMxSCxPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDO0NBQUE7QUFWRCxnRUFVQztBQUVELFNBQXNCLHlCQUF5Qjs7UUFDM0MsTUFBTSxRQUFRLEdBQUc7Ozs7OztLQU1oQixDQUFBO1FBQ0QsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQWtCLGVBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN0RSxPQUFPLFVBQVUsQ0FBQTtJ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