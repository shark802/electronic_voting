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
exports.totalUserVotedPerProgram = exports.totalUserVotedPerElection = exports.getAllCandidatesInElection = exports.getCandidatesTotalTally = exports.getElectionInfoById = void 0;
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
function totalUserVotedPerProgram() {
    return __awaiter(this, void 0, void 0, function* () {
        const sqlQuery = `
        SELECT e.election_id, u.course, COUNT(DISTINCT v.voter_id) AS total_voted
        FROM elections e
        JOIN votes v ON e.election_id = v.election_id
        JOIN users u ON v.voter_id = u.id_number
        WHERE e.is_close = 0
        GROUP BY e.election_id, u.course;
    `;
        const totalVoted = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery);
        return totalVoted;
    });
}
exports.totalUserVotedPerProgram = totalUserVotedPerProgram;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGF0YV9hY2Nlc3MvZWxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsaURBQTBDO0FBRTFDLG1DQUFzQztBQUV0QyxTQUFzQixtQkFBbUIsQ0FBQyxVQUFrQjs7UUFDeEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFXLGVBQUksRUFBRSxzRUFBc0UsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDM0ksT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztDQUFBO0FBSEQsa0RBR0M7QUFFRCxTQUFzQix1QkFBdUIsQ0FBQyxVQUFrQjs7UUFDNUQsTUFBTSxRQUFRLEdBQUc7Ozs7Ozs7S0FPaEIsQ0FBQTtRQUNELE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQUMsZUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDNUUsT0FBTyxtQkFBbUIsQ0FBQztJQUMvQixDQUFDO0NBQUE7QUFYRCwwREFXQztBQUVELFNBQXNCLDBCQUEwQixDQUFDLFVBQWtCOztRQUMvRCxNQUFNLFFBQVEsR0FBRzs7Ozs7S0FLaEIsQ0FBQTtRQUVELE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFDLGVBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsc0RBQXNEO1FBQzFILE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7Q0FBQTtBQVZELGdFQVVDO0FBRUQsU0FBc0IseUJBQXlCOztRQUMzQyxNQUFNLFFBQVEsR0FBRzs7Ozs7O0tBTWhCLENBQUE7UUFDRCxNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBa0IsZUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3RFLE9BQU8sVUFBVSxDQUFBO0lBQ3JCLENBQUM7Q0FBQTtBQVZELDhEQVVDO0FBRUQsU0FBc0Isd0JBQXdCOztRQUMxQyxNQUFNLFFBQVEsR0FBRzs7Ozs7OztLQU9oQixDQUFBO1FBQ0QsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQWtCLGVBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN0RSxPQUFPLFVBQVUsQ0FBQTtJQUNyQixDQUFDO0NBQUE7QUFYRCw0REFXQyJ9