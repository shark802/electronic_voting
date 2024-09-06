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
exports.getTotalVotedInElectionByProgram = exports.getTotalPopulationByProgram = exports.getNumberOfVoted = exports.getElectionPopulation = exports.closeElectionDashboard = exports.updateElectionStatus = exports.updateElection = exports.deleteElection = exports.findElectionByID = exports.createElection = void 0;
const database_1 = require("../../config/database");
const ulid_1 = require("ulid");
const customErrors_1 = require("../../utils/customErrors");
const program_1 = require("../../utils/enums/program");
const query_1 = require("../../data_access/query");
function createElection(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { election_name, date_start, time_start, date_end, time_end } = req.body;
            if (!election_name || !date_start || !time_start || !date_end || !time_end) {
                return next(new customErrors_1.BadRequestError("Bad request, some required data is missing"));
            }
            const election_id = (0, ulid_1.ulid)();
            const connection = yield database_1.pool.getConnection();
            try {
                yield connection.beginTransaction();
                const query = "INSERT INTO elections (election_id, election_name, date_start, time_start, date_end, time_end) VALUES (?, ?, ?, ?, ?, ?)";
                const values = [election_id, election_name, date_start, time_start, date_end, time_end];
                yield connection.execute(query, values);
                for (const program of Object.values(program_1.Program)) {
                    const insertProgramPopulationQuery = 'INSERT INTO program_populations (program_code, election_id) VALUES(?, ?)';
                    yield connection.execute(insertProgramPopulationQuery, [program, election_id]);
                }
                yield connection.commit();
                res.status(201).json({ message: "Election created" });
            }
            catch (error) {
                yield connection.rollback();
                next(error);
            }
            finally {
                yield connection.release();
            }
        }
        catch (error) {
            next(error);
        }
    });
}
exports.createElection = createElection;
/**
 * Function for searching specific election event based on id.
 * - assumes election_id is passed in req.query
 * - server will search election_id and response the resource back to client
 */
function findElectionByID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const election_id = req.params.id;
            if (!election_id)
                return next(new customErrors_1.BadRequestError("Cannot find Election if election_id is missing"));
            const query = "SELECT * FROM elections WHERE election_id = ? AND deleted_at IS NULL LIMIT 1";
            const value = [election_id];
            const result = yield (0, query_1.selectQuery)(database_1.pool, query, value);
            if (result.length < 1) {
                return next(new customErrors_1.NotFoundError());
            }
            res.status(200).json({ election: result[0] });
        }
        catch (error) {
            return next(error);
        }
    });
}
exports.findElectionByID = findElectionByID;
function deleteElection(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const election_id = req.params.id;
            if (!election_id) {
                return next(new customErrors_1.BadRequestError("Election Id is missing"));
            }
            const query = "UPDATE elections SET deleted_at = CURRENT_TIMESTAMP WHERE election_id = ? LIMIT 1";
            const value = [election_id];
            const result = yield (0, query_1.updateQuery)(database_1.pool, query, value);
            if (result.affectedRows < 1) {
                return next(new customErrors_1.NotFoundError("No changes were made"));
            }
            res.sendStatus(200);
        }
        catch (error) {
            return next(error);
        }
    });
}
exports.deleteElection = deleteElection;
function updateElection(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const election_id = req.params.id;
            const { election_name, date_start, time_start, date_end, time_end } = req.body;
            if (!election_name || !date_start || !time_start || !date_end || !time_end) {
                return next(new customErrors_1.BadRequestError());
            }
            const query = "UPDATE elections SET election_name = ?, date_start= ?, time_start = ?, date_end = ?, time_end = ? WHERE election_id = ? AND deleted_at IS NULL LIMIT 1";
            const parameter = [election_name, date_start, time_start, date_end, time_end, election_id];
            const result = yield (0, query_1.updateQuery)(database_1.pool, query, parameter);
            if (result.affectedRows < 1) {
                return next(new customErrors_1.NotFoundError("No changes were made"));
            }
            res.status(200).end();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateElection = updateElection;
function updateElectionStatus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const electionID = req.params.id;
            const electionStatus = req.query.status;
            if (!electionID || !electionStatus)
                return next(new customErrors_1.BadRequestError());
            const query = "UPDATE elections SET is_active = ? WHERE election_id = ? AND deleted_at IS NULL";
            const sqlParams = [electionStatus, electionID];
            const result = yield (0, query_1.updateQuery)(database_1.pool, query, sqlParams);
            if (result.affectedRows < 1)
                return next(new customErrors_1.NotFoundError(`Updating election ${electionID} dont affect, Resource may not found`));
            return res.status(200).json({ result });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateElectionStatus = updateElectionStatus;
function closeElectionDashboard(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const electionId = req.params.id;
            if (!electionId)
                throw new customErrors_1.BadRequestError('Election Id is missing!');
            const updateResult = yield (0, query_1.updateQuery)(database_1.pool, 'UPDATE elections SET is_close = 1 WHERE election_id = ?', [electionId]);
            if (updateResult.affectedRows === 0)
                throw new customErrors_1.BadRequestError('No changes were made, election not found');
            return res.status(200).json({ message: 'Election successfully closed' });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.closeElectionDashboard = closeElectionDashboard;
function getElectionPopulation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const electionIdQueryParams = req.query.election_id;
            if (!electionIdQueryParams)
                throw new customErrors_1.BadRequestError('No election id provided');
            const electionIdArray = Array.isArray(electionIdQueryParams) ? electionIdQueryParams : [electionIdQueryParams];
            const sqlQuery = `SELECT election_id, total_populations FROM elections WHERE election_id IN (?)`;
            const elections = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [electionIdArray]);
            return res.status(200).json({ elections });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getElectionPopulation = getElectionPopulation;
function getNumberOfVoted(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const electionIdQueryParams = req.query.election_id;
            if (!electionIdQueryParams)
                throw new customErrors_1.BadRequestError('No election id provided');
            const electionIdArray = Array.isArray(electionIdQueryParams) ? electionIdQueryParams : [electionIdQueryParams];
            const sqlQuery = `SELECT election_id, COUNT(DISTINCT voter_id) as voted FROM votes WHERE election_id IN (?) GROUP BY election_id`;
            const elections = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [electionIdArray]);
            return res.status(200).json({ elections });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getNumberOfVoted = getNumberOfVoted;
function getTotalPopulationByProgram(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const electionIdQueryParams = req.query.election_id;
            const programCode = req.query.program;
            if (!electionIdQueryParams)
                throw new customErrors_1.BadRequestError('No election id provided');
            if (!programCode)
                throw new customErrors_1.BadRequestError('No program provided');
            const electionIdArray = Array.isArray(electionIdQueryParams) ? electionIdQueryParams : [electionIdQueryParams];
            const sqlQuery = `SELECT program_population, program_code, election_id FROM program_populations WHERE program_code = ? AND election_id IN (?)`;
            const programPopulation = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [programCode, electionIdArray]);
            return res.status(200).json({ programPopulation });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getTotalPopulationByProgram = getTotalPopulationByProgram;
function getTotalVotedInElectionByProgram(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const electionIdQueryParams = req.query.election_id;
            const programCode = req.query.program;
            if (!electionIdQueryParams)
                throw new customErrors_1.BadRequestError('No election id provided');
            if (!programCode)
                throw new customErrors_1.BadRequestError('No program provided');
            const electionIdArray = Array.isArray(electionIdQueryParams) ? electionIdQueryParams : [electionIdQueryParams];
            const sqlQuery = `
			SELECT COUNT( DISTINCT v.voter_id ) as total_voted, v.election_id, u.course 
			FROM votes v
			LEFT JOIN users u
			ON v.voter_id = u.id_number
			WHERE u.course = ? AND v.election_id IN (?) 
			GROUP BY v.election_id
		`;
            const programVoteCount = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [programCode, electionIdArray]);
            return res.status(200).json({ programVoteCount });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getTotalVotedInElectionByProgram = getTotalVotedInElectionByProgram;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL2NvbnRyb2xsZXJzL2VsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG9EQUE2QztBQUM3QywrQkFBMkI7QUFDM0IsMkRBQTBFO0FBRTFFLHVEQUFvRDtBQUNwRCxtREFBbUU7QUFHbkUsU0FBc0IsY0FBYyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQ25GLElBQUksQ0FBQztZQUNKLE1BQU0sRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUMvRSxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzVFLE9BQU8sSUFBSSxDQUFDLElBQUksOEJBQWUsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDLENBQUM7WUFDaEYsQ0FBQztZQUNELE1BQU0sV0FBVyxHQUFHLElBQUEsV0FBSSxHQUFFLENBQUM7WUFFM0IsTUFBTSxVQUFVLEdBQUcsTUFBTSxlQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDOUMsSUFBSSxDQUFDO2dCQUNKLE1BQU0sVUFBVSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBRXBDLE1BQU0sS0FBSyxHQUFHLDBIQUEwSCxDQUFDO2dCQUN6SSxNQUFNLE1BQU0sR0FBRyxDQUFDLFdBQVcsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRXhGLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRXhDLEtBQUssTUFBTSxPQUFPLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxpQkFB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