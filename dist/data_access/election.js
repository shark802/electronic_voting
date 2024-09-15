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
exports.getDepartmentsTotalVotes = exports.getDepartmentsTotalPopulation = exports.totalUserVotedPerElection = exports.getAllCandidatesInElection = exports.getCandidatesTotalTally = exports.getElectionInfoById = void 0;
const database_1 = require("../config/database");
const query_1 = require("./query");
const BccDepartments_1 = require("../config/constants/BccDepartments");
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
        LEFT JOIN votes v ON c.id_number = v.candidate_id  
        LEFT JOIN users u ON u.id_number = c.id_number     
        WHERE c.election_id = ? 
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
// export async function totalUserVotedPerProgram() {
//     const sqlQuery = `
//         SELECT e.election_id, u.course, COUNT(DISTINCT v.voter_id) AS total_voted
//         FROM elections e
//         JOIN votes v ON e.election_id = v.election_id
//         JOIN users u ON v.voter_id = u.id_number
//         WHERE e.is_close = 0
//         GROUP BY e.election_id, u.course;
//     `
//     const totalVoted = await selectQuery<RowDataPacket[]>(pool, sqlQuery);
//     return totalVoted
// }
function getDepartmentsTotalPopulation(electionIdArray) {
    return __awaiter(this, void 0, void 0, function* () {
        const sqlQuery = `SELECT * FROM program_populations WHERE election_id = ? AND program_code = ?`;
        const electionDepartmentTotalPopulation = []; // will accumulate all elections vote summary per department
        for (const electionId of electionIdArray) {
            const departmentTotalPopulation = {
                election_id: electionId,
                department_total_population: {}
            };
            for (const departmentCode of Object.keys(BccDepartments_1.DEPARTMENT)) {
                const [result] = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [electionId, departmentCode]);
                departmentTotalPopulation.department_total_population[departmentCode] = (result ? result.program_population : 0);
            }
            electionDepartmentTotalPopulation.push(departmentTotalPopulation);
        }
        return electionDepartmentTotalPopulation;
    });
}
exports.getDepartmentsTotalPopulation = getDepartmentsTotalPopulation;
function getDepartmentsTotalVotes(electionIdArray) {
    return __awaiter(this, void 0, void 0, function* () {
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
            for (const [departmentCode, programList] of Object.entries(BccDepartments_1.DEPARTMENT)) {
                const [result] = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [programList, electionId]);
                // Cast departmentCode to DepartmentCode type
                electionDepartmentVoteSummary.department_votes[departmentCode] = result ? result.total_voted : 0;
            }
            departmentVotesSummary.push(electionDepartmentVoteSummary);
        }
        return departmentVotesSummary;
    });
}
exports.getDepartmentsTotalVotes = getDepartmentsTotalVotes;
