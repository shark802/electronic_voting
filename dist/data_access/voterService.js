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
                    WHERE e.deleted_at IS NULL
                    GROUP BY v.election_id, u.id_number
                ) AS subquery
                ORDER BY time_casted DESC;`;
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
                    WHERE v.election_id = ? AND e.deleted_at IS NULL
                    GROUP BY v.election_id, u.id_number
                ) AS subquery
                ORDER BY time_casted DESC;`;
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
                    WHERE v.election_id = ? AND u.id_number = ? AND e.deleted_at IS NULL
                    GROUP BY v.election_id, u.id_number
                ) AS subquery
                ORDER BY time_casted DESC;`;
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
                    WHERE u.id_number = ? AND e.deleted_at IS NULL
                    GROUP BY v.election_id, u.id_number
                ) AS subquery
                ORDER BY time_casted DESC;`;
        return yield (0, query_1.selectQuery)(database_1.pool, getAllUserElectionParticipatedQuery, [userId]);
    });
}
exports.getAllUserElectionParticipatedIn = getAllUserElectionParticipatedIn;
// Count all total voter for election
function countAllQualifiedVoterForElection() {
    return __awaiter(this, void 0, void 0, function* () {
        const [totalPopulation] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT COUNT(*) as total_population FROM users WHERE is_active = 1');
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
