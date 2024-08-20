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
exports.getAllUserElectionParticipatedIn = exports.findOneUserVotedInElection = exports.getAllRecentUsersVotedInElection = exports.getAllRecentUsersVoted = void 0;
const database_1 = require("../config/database");
const query_1 = require("./query");
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
