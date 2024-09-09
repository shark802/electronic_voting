import { Request, Response, NextFunction } from "express";
import { pool } from "../../config/database";
import { ulid } from "ulid"
import { BadRequestError, ConflictError, NotFoundError } from "../../utils/customErrors";
import { Election } from "../../utils/types/Election";
import { Program } from "../../utils/enums/program";
import { selectQuery, updateQuery } from "../../data_access/query";
import { isElectionEnded, isElectionStarted } from '../../utils/checkElectionTimeStatus';
import { eventEmitter } from '../../events/globalEventEmitterInstance';
import { DEPARTMENT } from "../../config/constants/BccDepartments";


export async function createElection(req: Request, res: Response, next: NextFunction) {
	try {
		const { election_name, date_start, time_start, date_end, time_end } = req.body;
		if (!election_name || !date_start || !time_start || !date_end || !time_end) {
			return next(new BadRequestError("Bad request, some required data is missing"));
		}

		const openElection = await selectQuery<Election>(pool, 'SELECT * FROM elections WHERE is_active = 1 AND (date_end > CURRENT_DATE OR (date_end = CURRENT_DATE AND time_end > CURTIME())) AND deleted_at IS NULL');
		if (openElection.length > 0) throw new ConflictError('An active election is currrently running');

		const election_id = ulid();

		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();

			const query = "INSERT INTO elections (election_id, election_name, date_start, time_start, date_end, time_end) VALUES (?, ?, ?, ?, ?, ?)";
			const values = [election_id, election_name, date_start, time_start, date_end, time_end];

			await connection.execute(query, values);

			for (const [department, programs] of Object.entries(DEPARTMENT)) {

				const year_active = new Date().getFullYear();
				const [countDepartmentPopulation] = await selectQuery<{ population: number }>(pool, 'SELECT COUNT(*) as population FROM users WHERE course IN (?) AND year_active = ?', [programs, year_active])

				const insertProgramPopulationQuery = 'INSERT INTO program_populations (program_code, program_population, election_id) VALUES(?, ?, ?)';
				await connection.execute(insertProgramPopulationQuery, [department, countDepartmentPopulation.population, election_id]);
			}

			await connection.commit();

			// Emit an event to register voters for election that just created
			eventEmitter.emit('addCandidateEvent', election_id);

			res.status(201).json({ message: "Election created" });
		} catch (error) {
			await connection.rollback();
			next(error)
		} finally {
			await connection.release();
		}

	} catch (error) {
		next(error);
	}
}


/**
 * Function for searching specific election event based on id.
 * - assumes election_id is passed in req.query
 * - server will search election_id and response the resource back to client
 */
export async function findElectionByID(req: Request, res: Response, next: NextFunction) {
	try {
		const election_id = req.params.id
		if (!election_id) return next(new BadRequestError("Cannot find Election if election_id is missing"))

		const query = "SELECT * FROM elections WHERE election_id = ? AND deleted_at IS NULL LIMIT 1"
		const value = [election_id]
		const result = await selectQuery<Election>(pool, query, value)

		if (result.length < 1) {
			return next(new NotFoundError())
		}

		res.status(200).json({ election: result[0] })
	} catch (error) {
		return next(error)
	}
}

export async function deleteElection(req: Request, res: Response, next: NextFunction) {
	try {
		const election_id = req.params.id

		if (!election_id) {
			return next(new BadRequestError("Election Id is missing"))
		}

		const [election] = await selectQuery<Election>(pool, 'SELECT * FROM elections WHERE election_id = ? LIMIT 1', [election_id]);
		if (isElectionStarted(election)) throw new BadRequestError('Cannot delete an election that has already started.');
		if (isElectionEnded(election)) throw new BadRequestError('Cannot delete an election that has already ended.');

		const query = "UPDATE elections SET deleted_at = CURRENT_TIMESTAMP WHERE election_id = ? LIMIT 1";
		const value = [election_id]

		const result = await updateQuery(pool, query, value)
		if (result.affectedRows < 1) {
			return next(new NotFoundError("No changes were made"))
		}

		res.sendStatus(200)

	} catch (error) {
		return next(error)
	}
}

export async function updateElection(req: Request, res: Response, next: NextFunction) {
	try {
		const election_id = req.params.id
		const { election_name, date_start, time_start, date_end, time_end } = req.body

		if (!election_name || !date_start || !time_start || !date_end || !time_end) {
			return next(new BadRequestError())
		}

		const query = "UPDATE elections SET election_name = ?, date_start= ?, time_start = ?, date_end = ?, time_end = ? WHERE election_id = ? AND deleted_at IS NULL LIMIT 1"
		const parameter = [election_name, date_start, time_start, date_end, time_end, election_id];

		const result = await updateQuery(pool, query, parameter)

		if (result.affectedRows < 1) {
			return next(new NotFoundError("No changes were made"))
		}

		res.status(200).end()

	} catch (error) {
		next(error)
	}
}

export async function updateElectionStatus(req: Request, res: Response, next: NextFunction) {
	try {
		const electionID = req.params.id;
		const electionStatus = req.query.status
		if (!electionID || !electionStatus) return next(new BadRequestError());

		const [election] = await selectQuery<Election>(pool, 'SELECT * FROM elections WHERE election_id = ?', [electionID]);
		const isElectionEnd = isElectionEnded(election);

		// if request is to activate the election, check first if there is active election running before allowing to activate the election except for active election but already ended.
		if ((electionStatus as string) === '1' && !isElectionEnd) {
			const activeElection = await selectQuery<Election>(pool, `SELECT * FROM elections WHERE is_active = 1 AND (date_end > CURRENT_DATE OR (date_end = CURRENT_DATE AND time_end > CURTIME()) AND deleted_at IS NULL)`);
			if (activeElection.length > 0) throw new BadRequestError('An active election is currently running')
		}

		const query = "UPDATE elections SET is_active = ? WHERE election_id = ? AND deleted_at IS NULL";
		const sqlParams = [electionStatus, electionID]
		const result = await updateQuery(pool, query, sqlParams);

		if (result.affectedRows < 1) return next(new NotFoundError(`Updating election ${electionID} dont affect, Resource may not found`));
		return res.status(200).json({ result });

	} catch (error) {
		next(error);
	}
}

export async function closeElectionDashboard(req: Request, res: Response, next: NextFunction) {
	try {
		const electionId = req.params.id;
		if (!electionId) throw new BadRequestError('Election Id is missing!');

		const updateResult = await updateQuery(pool, 'UPDATE elections SET is_close = 1 WHERE election_id = ?', [electionId]);
		if (updateResult.affectedRows === 0) throw new BadRequestError('No changes were made, election not found');

		return res.status(200).json({ message: 'Election successfully closed' })

	} catch (error) {
		next(error);
	}
}

export async function getElectionPopulation(req: Request, res: Response, next: NextFunction) {
	try {

		const electionIdQueryParams = req.query.election_id;
		if (!electionIdQueryParams) throw new BadRequestError('No election id provided');

		const electionIdArray = Array.isArray(electionIdQueryParams) ? electionIdQueryParams as string[] : [electionIdQueryParams as string];

		const sqlQuery = `SELECT election_id, total_populations FROM elections WHERE election_id IN (?)`
		const elections = await selectQuery(pool, sqlQuery, [electionIdArray]);

		return res.status(200).json({ elections })
	} catch (error) {
		next(error);
	}
}

export async function getNumberOfVoted(req: Request, res: Response, next: NextFunction) {
	try {

		const electionIdQueryParams = req.query.election_id;
		if (!electionIdQueryParams) throw new BadRequestError('No election id provided');

		const electionIdArray = Array.isArray(electionIdQueryParams) ? electionIdQueryParams as string[] : [electionIdQueryParams as string];

		const sqlQuery = `SELECT election_id, COUNT(DISTINCT voter_id) as voted FROM votes WHERE election_id IN (?) GROUP BY election_id`
		const elections = await selectQuery(pool, sqlQuery, [electionIdArray]);

		return res.status(200).json({ elections })

	} catch (error) {
		next(error)
	}
}

export async function getTotalPopulationByProgram(req: Request, res: Response, next: NextFunction) {
	try {
		const electionIdQueryParams = req.query.election_id;
		const programCode = req.query.program;

		if (!electionIdQueryParams) throw new BadRequestError('No election id provided');
		if (!programCode) throw new BadRequestError('No program provided');

		const electionIdArray = Array.isArray(electionIdQueryParams) ? electionIdQueryParams as string[] : [electionIdQueryParams as string];

		const sqlQuery = `SELECT program_population, program_code, election_id FROM program_populations WHERE program_code = ? AND election_id IN (?)`
		const programPopulation = await selectQuery(pool, sqlQuery, [programCode, electionIdArray]);

		return res.status(200).json({ programPopulation });
	} catch (error) {
		next(error)
	}
}

export async function getTotalVotedInElectionByProgram(req: Request, res: Response, next: NextFunction) {
	try {

		const electionIdQueryParams = req.query.election_id;
		const programCode = req.query.program;

		if (!electionIdQueryParams) throw new BadRequestError('No election id provided');
		if (!programCode) throw new BadRequestError('No program provided');

		const electionIdArray = Array.isArray(electionIdQueryParams) ? electionIdQueryParams as string[] : [electionIdQueryParams as string];

		const sqlQuery = `
			SELECT COUNT( DISTINCT v.voter_id ) as total_voted, v.election_id, u.course 
			FROM votes v
			LEFT JOIN users u
			ON v.voter_id = u.id_number
			WHERE u.course = ? AND v.election_id IN (?) 
			GROUP BY v.election_id
		`

		const programVoteCount = await selectQuery(pool, sqlQuery, [programCode, electionIdArray]);

		return res.status(200).json({ programVoteCount });
	} catch (error) {
		next(error)
	}
}
