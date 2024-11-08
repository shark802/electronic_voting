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
exports.getAllNotVotedInElection = exports.countAllQualifiedVoterForElection = exports.getAllUserElectionParticipatedIn = exports.findOneUserVotedInElection = exports.getAllRecentUsersVotedInElection = exports.getAllRecentUsersVoted = exports.getAllVoterInElection = void 0;
const database_1 = require("../config/database");
const query_1 = require("./query");
function getAllVoterInElection(electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const selectAllVoterQuery = `
        SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section, v.election_id, v.voted
        FROM users u
        JOIN voters v
        ON u.id_number = v.id_number
        WHERE v.election_id = ?
        ORDER BY u.lastname
        `;
        const voters = yield (0, query_1.selectQuery)(database_1.pool, selectAllVoterQuery, [electionId]);
        return voters;
    });
}
exports.getAllVoterInElection = getAllVoterInElection;
// Select all recent log of user voted in the system
function getAllRecentUsersVoted() {
    return __awaiter(this, void 0, void 0, function* () {
        const selectAllVotedQuery = `
                SELECT * FROM (
                    SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section, v.election_id, MIN(v.time_casted) AS time_casted, e.election_name
                    FROM users u
                    JOIN votes v ON u.id_number = v.voter_id
                    JOIN elections e ON v.election_id = e.election_id
                    GROUP BY v.election_id, u.id_number
                ) AS subquery
                ORDER BY time_casted DESC
                LIMIT 50;`;
        return yield (0, query_1.selectQuery)(database_1.pool, selectAllVotedQuery);
    });
}
exports.getAllRecentUsersVoted = getAllRecentUsersVoted;
// Select all recent user voted in one specific election
function getAllRecentUsersVotedInElection(electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const selectAllVotedByElectionQuery = `
                SELECT * FROM (
                    SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section, v.election_id, MIN(v.time_casted) AS time_casted, e.election_name
                    FROM users u
                    JOIN votes v ON u.id_number = v.voter_id
                    JOIN elections e ON v.election_id = e.election_id
                    WHERE v.election_id = ?
                    GROUP BY v.election_id, u.id_number
                ) AS subquery
                ORDER BY time_casted DESC
                LIMIT 50;`;
        return yield (0, query_1.selectQuery)(database_1.pool, selectAllVotedByElectionQuery, [electionId]);
    });
}
exports.getAllRecentUsersVotedInElection = getAllRecentUsersVotedInElection;
// function for finding voter base on id_number and election_id provided
function findOneUserVotedInElection(electionId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const findOneUserVotedInElectionQuery = `
                SELECT * FROM (
                    SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section, v.election_id, MIN(v.time_casted) AS time_casted, e.election_name
                    FROM users u
                    JOIN votes v ON u.id_number = v.voter_id
                    JOIN elections e ON v.election_id = e.election_id
                    WHERE v.election_id = ? AND u.id_number = ?
                    GROUP BY v.election_id, u.id_number
                ) AS subquery
                ORDER BY time_casted DESC
                LIMIT 50;`;
        return yield (0, query_1.selectQuery)(database_1.pool, findOneUserVotedInElectionQuery, [electionId, userId]);
    });
}
exports.findOneUserVotedInElection = findOneUserVotedInElection;
// Select all election that user participated or voted in
function getAllUserElectionParticipatedIn(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const getAllUserElectionParticipatedQuery = `
                SELECT * FROM (
                    SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section, v.election_id, MIN(v.time_casted) AS time_casted, e.election_name
                    FROM users u
                    JOIN votes v ON u.id_number = v.voter_id
                    JOIN elections e ON v.election_id = e.election_id
                    WHERE u.id_number = ?
                    GROUP BY v.election_id, u.id_number
                ) AS subquery
                ORDER BY time_casted DESC
                LIMIT 50;`;
        return yield (0, query_1.selectQuery)(database_1.pool, getAllUserElectionParticipatedQuery, [userId]);
    });
}
exports.getAllUserElectionParticipatedIn = getAllUserElectionParticipatedIn;
// Count all total voter for election
function countAllQualifiedVoterForElection() {
    return __awaiter(this, void 0, void 0, function* () {
        const year_active = new Date().getFullYear();
        const [totalPopulation] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT COUNT(*) as total_population FROM users WHERE year_active = ?', [year_active]);
        return totalPopulation.total_population;
    });
}
exports.countAllQualifiedVoterForElection = countAllQualifiedVoterForElection;
// select all voters not voted in specific election
function getAllNotVotedInElection(electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sqlQuery = `
        SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section 
        FROM voters v
        JOIN users u
        ON v.id_number = u.id_number
        WHERE v.election_id = ? AND v.voted = 0
        ORDER BY u.lastname
    `;
        const voters = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [electionId]);
        return voters;
    });
}
exports.getAllNotVotedInElection = getAllNotVotedInElection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZXJTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RhdGFfYWNjZXNzL3ZvdGVyU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSxpREFBMEM7QUFDMUMsbUNBQXNDO0FBSXRDLFNBQXNCLHFCQUFxQixDQUFDLFVBQWtCOztRQUMxRCxNQUFNLG1CQUFtQixHQUFHOzs7Ozs7O1NBT3ZCLENBQUM7UUFHTixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBWSxlQUFJLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBRXJGLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7Q0FBQTtBQWRELHNEQWNDO0FBRUQsb0RBQW9EO0FBQ3BELFNBQXNCLHNCQUFzQjs7UUFDeEMsTUFBTSxtQkFBbUIsR0FBRzs7Ozs7Ozs7OzBCQVNOLENBQUE7UUFFdEIsT0FBTyxNQUFNLElBQUEsbUJBQVcsRUFBQyxlQUFJLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUN4RCxDQUFDO0NBQUE7QUFiRCx3REFhQztBQUVELHdEQUF3RDtBQUN4RCxTQUFzQixnQ0FBZ0MsQ0FBQyxVQUFrQjs7UUFDckUsTUFBTSw2QkFBNkIsR0FBRzs7Ozs7Ozs7OzswQkFVaEIsQ0FBQTtRQUV0QixPQUFPLE1BQU0sSUFBQSxtQkFBVyxFQUFDLGVBQUksRUFBRSw2QkFBNkIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDaEYsQ0FBQztDQUFBO0FBZEQsNEVBY0M7QUFFRCx3RUFBd0U7QUFDeEUsU0FBc0IsMEJBQTBCLENBQUMsVUFBa0IsRUFBRSxNQUFjOztRQUMvRSxNQUFNLCtCQUErQixHQUFHOzs7Ozs7Ozs7OzBCQVVsQixDQUFBO1FBRXRCLE9BQU8sTUFBTSxJQUFBLG1CQUFXLEVBQUMsZUFBSSxFQUFFLCtCQUErQixFQUFFLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFDekYsQ0FBQztDQUFBO0FBZEQsZ0VBY0M7QUFFRCx5REFBeUQ7QUFDekQsU0FBc0IsZ0NBQWdDLENBQUMsTUFBYzs7UUFDakUsTUFBTSxtQ0FBbUMsR0FBRzs7Ozs7Ozs7OzswQkFVdEIsQ0FBQTtRQUV0QixPQUFPLE1BQU0sSUFBQSxtQkFBVyxFQUFDLGVBQUksRUFBRSxtQ0FBbUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFDakYsQ0FBQztDQUFBO0FBZEQsNEVBY0M7QUFFRCxxQ0FBcUM7QUFDckMsU0FBc0IsaUNBQWlDOztRQUNuRCxNQUFNLFdBQVcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBTTdDLE1BQU0sQ0FBQyxlQUFlLENBQUMsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBa0IsZUFBSSxFQUFFLHNFQUFzRSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUMxSixPQUFPLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQztJQUU1QyxDQUFDO0NBQUE7QUFWRCw4RUFVQztBQUVELG1EQUFtRDtBQUNuRCxTQUFzQix3QkFBd0IsQ0FBQyxVQUFrQjs7UUFFN0QsTUFBTSxRQUFRLEdBQUc7Ozs7Ozs7S0FPaEIsQ0FBQTtRQUdELE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFZLGVBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBRTFFLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7Q0FBQTtBQWZELDREQWVDIn0=