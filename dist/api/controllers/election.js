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
exports.departmentTurnoutPercentage = exports.yearLevelTurnoutPercentage = exports.completedElectionsTotalVoted = exports.getTotalVotedInElectionByProgram = exports.getTotalPopulationByProgram = exports.getNumberOfVoted = exports.getElectionPopulation = exports.closeElectionDashboard = exports.updateElectionStatus = exports.updateElection = exports.deleteElection = exports.findElectionByID = exports.createElection = void 0;
const database_1 = require("../../config/database");
const ulid_1 = require("ulid");
const customErrors_1 = require("../../utils/customErrors");
const query_1 = require("../../data_access/query");
const checkElectionTimeStatus_1 = require("../../utils/checkElectionTimeStatus");
const globalEventEmitterInstance_1 = require("../../events/globalEventEmitterInstance");
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
                const departments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
                const prgrams = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM programs WHERE deleted_at IS NULL');
                for (const department of departments) {
                    const programs = prgrams.filter(program => program.department === department.department_id).map(program => program.program_code);
                    const year_active = new Date().getFullYear();
                    const [countDepartmentPopulation] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT COUNT(*) as population FROM users WHERE course IN (?) AND year_active = ?', [programs, year_active]);
                    const insertProgramPopulationQuery = 'INSERT INTO program_populations (program_code, program_population, election_id) VALUES(?, ?, ?)';
                    yield connection.execute(insertProgramPopulationQuery, [department.department_code, countDepartmentPopulation.population, election_id]);
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
        const connection = yield database_1.pool.getConnection(); // Get a connection from the pool
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
            yield connection.beginTransaction(); // Start the transaction
            // Update the election with a soft delete
            const updateQuery = "UPDATE elections SET deleted_at = CURRENT_TIMESTAMP WHERE election_id = ? LIMIT 1";
            const [updateResult] = yield connection.query(updateQuery, [election_id]);
            if (updateResult.affectedRows === 0) {
                yield connection.rollback(); // Roll back the transaction if no rows were updated
                return next(new customErrors_1.NotFoundError("No changes were made"));
            }
            // Delete voters associated with this election
            const deleteVotersQuery = 'DELETE FROM voters WHERE election_id = ?';
            yield connection.query(deleteVotersQuery, [election_id]);
            yield connection.commit();
            res.sendStatus(200);
        }
        catch (error) {
            yield connection.rollback();
            return next(error);
        }
        finally {
            connection.release();
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
                const activeElection = yield (0, query_1.selectQuery)(database_1.pool, `SELECT * FROM elections WHERE is_active = 1 AND (date_end > CURDATE() OR (date_end = CURDATE() AND time_end > CURTIME())) AND deleted_at IS NULL`);
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
function completedElectionsTotalVoted(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const completedElections = yield (0, election_1.getAllCompleteElection)();
            const noTotalVotedElection = completedElections.filter(election => election.total_voted === null);
            if (noTotalVotedElection.length > 0) {
                const countTotalVotedQuery = `SELECT election_id, COUNT(DISTINCT voter_id) as total_voted FROM votes WHERE election_id = ?`;
                for (const election of noTotalVotedElection) {
                    const [totalVoted] = yield (0, query_1.selectQuery)(database_1.pool, countTotalVotedQuery, [election.election_id]);
                    // Set total voted in election
                    yield (0, query_1.updateQuery)(database_1.pool, 'UPDATE elections SET total_voted = ? WHERE election_id = ?', [totalVoted.total_voted, election.election_id]);
                    // Update total voted property of previous null value, in elections with no total
                    completedElections.forEach(completeElection => {
                        if (completeElection.election_id === election.election_id) {
                            completeElection.total_voted = totalVoted.total_voted;
                        }
                    });
                }
            }
            res.json({ completedElections });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.completedElectionsTotalVoted = completedElectionsTotalVoted;
function yearLevelTurnoutPercentage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sqlQuery = `
			SELECT
				users.year_level,
				elections.election_id,
				COUNT(DISTINCT voters.id_number) AS total_voters,
				COUNT(DISTINCT CASE WHEN votes.voter_id IS NOT NULL THEN votes.voter_id END) AS total_voted
			FROM voters
			LEFT JOIN users ON voters.id_number = users.id_number
			LEFT JOIN votes ON voters.id_number = votes.voter_id AND voters.election_id = votes.election_id
			LEFT JOIN elections ON voters.election_id = elections.election_id
			WHERE (elections.date_end < CURDATE() 
			OR (elections.date_end = CURDATE() AND elections.time_end < CURTIME()))
			AND elections.deleted_at IS NULL
			GROUP BY users.year_level, elections.election_id
			ORDER BY elections.date_end ASC, elections.time_end ASC
		`;
            const result = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery);
            const turnoutPerYearLevel = result.map(election => {
                const turnOutPercentage = ((election.total_voted / election.total_voters) * 100).toFixed(2);
                return {
                    electionId: election.election_id,
                    turnOutPercentage: turnOutPercentage,
                    yearLevel: election.year_level,
                    totalVoter: election.total_voters,
                    totalVoted: election.total_voted,
                };
            });
            return res.status(200).json({ turnoutPerYearLevel });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.yearLevelTurnoutPercentage = yearLevelTurnoutPercentage;
function departmentTurnoutPercentage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sqlQuery = `
			SELECT
				departments.department_code,
				elections.election_id,
				COUNT(DISTINCT voters.id_number) AS total_voters,
				COUNT(DISTINCT CASE WHEN votes.voter_id IS NOT NULL AND votes.election_id = elections.election_id THEN votes.voter_id END) AS total_voted
			FROM voters
			LEFT JOIN users ON voters.id_number = users.id_number
			LEFT JOIN votes ON votes.voter_id = users.id_number AND votes.election_id = voters.election_id
			LEFT JOIN programs ON programs.program_code = users.course
			LEFT JOIN departments ON programs.department = departments.department_id
			LEFT JOIN elections ON elections.election_id = voters.election_id
			WHERE (elections.date_end < CURDATE()
				OR (elections.date_end = CURDATE() AND elections.time_end < CURTIME()))
				AND elections.deleted_at IS NULL
				AND programs.deleted_at IS NULL
			GROUP BY elections.election_id, departments.department_code
			ORDER BY elections.date_end ASC, elections.time_end ASC;
			`;
            const result = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery);
            const turnoutPerDepartment = result.map(election => {
                const turnOutPercentage = ((election.total_voted / election.total_voters) * 100).toFixed(2);
                return {
                    electionId: election.election_id,
                    turnOutPercentage: turnOutPercentage,
                    department: election.department_code,
                    totalVoter: election.total_voters,
                    totalVoted: election.total_voted,
                };
            });
            return res.status(200).json({ turnoutPerDepartment });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.departmentTurnoutPercentage = departmentTurnoutPercentage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL2NvbnRyb2xsZXJzL2VsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG9EQUE2QztBQUM3QywrQkFBMkI7QUFDM0IsMkRBQXlGO0FBRXpGLG1EQUFnRjtBQUNoRixpRkFBeUY7QUFDekYsd0ZBQXVFO0FBQ3ZFLGlFQUFtRjtBQUNuRix5REFBNkg7QUFNN0gsU0FBc0IsY0FBYyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQ25GLElBQUksQ0FBQztZQUNKLE1BQU0sRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUMvRSxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzVFLE9BQU8sSUFBSSxDQUFDLElBQUksOEJBQWUsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDLENBQUM7WUFDaEYsQ0FBQztZQUVELE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFXLGVBQUksRUFBRSx3SkFBd0osQ0FBQyxDQUFDO1lBQ2pOLElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUFFLE1BQU0sSUFBSSw0QkFBYSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7WUFFakcsTUFBTSxXQUFXLEdBQUcsSUFBQSxXQUFJLEdBQUUsQ0FBQztZQUMzQixNQUFNLG1CQUFtQixHQUFHLE1BQU0sSUFBQSxnREFBaUMsR0FBRSxDQUFDO1lBRXRFLE1BQU0sVUFBVSxHQUFHLE1BQU0sZUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzlDLElBQUksQ0FBQztnQkFDSixNQUFNLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxD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