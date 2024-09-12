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
const query_1 = require("../../data_access/query");
const checkElectionTimeStatus_1 = require("../../utils/checkElectionTimeStatus");
const globalEventEmitterInstance_1 = require("../../events/globalEventEmitterInstance");
const BccDepartments_1 = require("../../config/constants/BccDepartments");
const voterService_1 = require("../../data_access/voterService");
const election_1 = require("../../data_access/election");
function createElection(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { election_name, date_start, time_start, date_end, time_end } = req.body;
            if (!election_name || !date_start || !time_start || !date_end || !time_end) {
                return next(new customErrors_1.BadRequestError("Bad request, some required data is missing"));
            }
            const openElection = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE is_active = 1 AND (date_end > CURRENT_DATE OR (date_end = CURRENT_DATE AND time_end > CURTIME())) AND deleted_at IS NULL');
            if (openElection.length > 0)
                throw new customErrors_1.ConflictError('An active election is currrently running');
            const election_id = (0, ulid_1.ulid)();
            const totalQualifiedVoter = yield (0, voterService_1.countAllQualifiedVoterForElection)();
            const connection = yield database_1.pool.getConnection();
            try {
                yield connection.beginTransaction();
                const query = "INSERT INTO elections (election_id, election_name, date_start, time_start, date_end, time_end, total_populations) VALUES (?, ?, ?, ?, ?, ?, ?)";
                const values = [election_id, election_name, date_start, time_start, date_end, time_end, totalQualifiedVoter];
                yield connection.execute(query, values);
                for (const [department, programs] of Object.entries(BccDepartments_1.DEPARTMENT)) {
                    const year_active = new Date().getFullYear();
                    const [countDepartmentPopulation] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT COUNT(*) as population FROM users WHERE course IN (?) AND year_active = ?', [programs, year_active]);
                    const insertProgramPopulationQuery = 'INSERT INTO program_populations (program_code, program_population, election_id) VALUES(?, ?, ?)';
                    yield connection.execute(insertProgramPopulationQuery, [department, countDepartmentPopulation.population, election_id]);
                }
                yield connection.commit();
                // Emit an event to register voters for election that just created
                globalEventEmitterInstance_1.eventEmitter.emit('addCandidateEvent', election_id);
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
            const [election] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE election_id = ? LIMIT 1', [election_id]);
            if ((0, checkElectionTimeStatus_1.isElectionStarted)(election))
                throw new customErrors_1.BadRequestError('Cannot delete an election that has already started.');
            if ((0, checkElectionTimeStatus_1.isElectionEnded)(election))
                throw new customErrors_1.BadRequestError('Cannot delete an election that has already ended.');
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
            const [election] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE election_id = ?', [electionID]);
            const isElectionEnd = (0, checkElectionTimeStatus_1.isElectionEnded)(election);
            // if request is to activate the election, check first if there is active election running before allowing to activate the election except for active election but already ended.
            if (electionStatus === '1' && !isElectionEnd) {
                const activeElection = yield (0, query_1.selectQuery)(database_1.pool, `SELECT * FROM elections WHERE is_active = 1 AND (date_end > CURRENT_DATE OR (date_end = CURRENT_DATE AND time_end > CURTIME()) AND deleted_at IS NULL)`);
                if (activeElection.length > 0)
                    throw new customErrors_1.BadRequestError('An active election is currently running');
            }
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
            if (!electionIdQueryParams)
                throw new customErrors_1.BadRequestError('No election id provided');
            const electionIdArray = Array.isArray(electionIdQueryParams) ? electionIdQueryParams : [electionIdQueryParams];
            const electionsDepartmentPopulation = yield (0, election_1.getDepartmentsTotalPopulation)(electionIdArray);
            return res.status(200).json({ electionPopulationSummary: electionsDepartmentPopulation });
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
            let electionIdQueryParams = req.query.election_id;
            if (!electionIdQueryParams)
                throw new customErrors_1.BadRequestError('No election id provided');
            electionIdQueryParams = Array.isArray(electionIdQueryParams) ? electionIdQueryParams : [electionIdQueryParams];
            const departmentVoteSummary = yield (0, election_1.getDepartmentsTotalVotes)(electionIdQueryParams);
            return res.status(200).json({ electionVoteSummary: departmentVoteSummary });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getTotalVotedInElectionByProgram = getTotalVotedInElectionByProgram;
