import { Request, Response, NextFunction } from "express";
import { pool } from "../../config/database";
import { ulid } from "ulid"
import { BadRequestError, NotFoundError } from "../../utils/customErrors";
import { Election } from "../../utils/types/Election";
import { Program } from "../../utils/enums/program";
import { selectQuery, updateQuery } from "../../data_access/query";


export async function createElection(req: Request, res: Response, next: NextFunction) {
	try {
		const { election_name, date_start, time_start, date_end, time_end } = req.body;
		if (!election_name || !date_start || !time_start || !date_end || !time_end) {
			return next(new BadRequestError("Bad request, some required data is missing"));
		}
		const election_id = ulid();

		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();

			const query = "INSERT INTO elections (election_id, election_name, date_start, time_start, date_end, time_end) VALUES (?, ?, ?, ?, ?, ?)";
			const values = [election_id, election_name, date_start, time_start, date_end, time_end];

			await connection.execute(query, values);

			for (const program of Object.values(Program)) {
				const insertProgramPopulationQuery = 'INSERT INTO program_populations (program_code, election_id) VALUES(?, ?)';
				await connection.execute(insertProgramPopulationQuery, [program, election_id]);
			}

			await connection.commit();
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
		console.log(electionId);
		if (!electionId) throw new BadRequestError('Election Id is missing!');

		const updateResult = await updateQuery(pool, 'UPDATE elections SET is_close = 1 WHERE election_id = ?', [electionId]);
		if (updateResult.affectedRows === 0) throw new BadRequestError('No changes were made, election not found');

		return res.status(200).json({ message: 'Election successfully closed' })

	} catch (error) {
		next(error);
	}
}