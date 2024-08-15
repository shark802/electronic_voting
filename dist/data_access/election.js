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
exports.totalUserVotedPerElection = exports.getAllCandidatesInElection = exports.getCandidatesTotalTally = exports.getElectionInfoById = void 0;
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
        SELECT u.id_number, u.firstname, u.lastname, u.course, v.position, COUNT(*) as vote_count
        FROM users u
        JOIN votes v
        ON u.id_number = v.candidate_id
        WHERE election_id = ?
        GROUP BY v.candidate_id, v.position
    `;
        const candidatesVoteTally = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [electionId]);
        return candidatesVoteTally;
    });
}
exports.getCandidatesTotalTally = getCandidatesTotalTally;
function getAllCandidatesInElection(electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sqlQuery = `
        SELECT u.id_number, u.firstname, u.lastname, u.course, c.position, c.vote_count
        FROM users u
        JOIN candidates c
        ON u.id_number = c.id_number
        WHERE election_id = ?
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
