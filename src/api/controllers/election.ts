import { Request, Response, NextFunction } from "express";
import { pool } from "../../config/database";
import { insertQuery, selectQuery, updateQuery } from "../../data_access/query";
import { ulid } from "ulid"
import { BadRequestError, InternalServerError, NotFoundError } from "../../utils/customErrors";
import { Election } from "../../utils/types/Election";


export async function createElection(req: Request, res: Response, next: NextFunction) {
	try {
		const { election_name, date_start, time_start, date_end, time_end } = req.body;
		if (!election_name || !date_start || !time_start || !date_end || !time_end) {
			return next(new BadRequestError("Bad request, some missing data is required"))
		}
		const election_id = ulid()

		const query = "INSERT INTO elections (election_id, election_name, date_start, time_start, date_end, time_end) VALUES (?, ?, ?, ?, ?, ?)"
		const values = [election_id, election_name, date_start, time_start, date_end, time_end]
		const result = await insertQuery(pool, query, values)

		if (result.affectedRows < 1) {
			return next(new InternalServerError("Failed to create election"))
		}

		res.status(201).json({message: "Election created"})
	} catch (error) {
		return next(error);
	}
}

/**
 * Function for searching specific election event based on id.
 * - assumes election_id is passed in req.query
 * - server will search election_id and response the resource back to client
 */
export async function findElectionByID(req: Request, res:Response, next: NextFunction) {
	try {
		const election_id = req.query.election_id
		if (!election_id) return next(new BadRequestError("Cannot find Election if election_id is missing"))
		
		const query = "SELECT * FROM elections WHERE election_id = ? AND deleted_at IS NULL LIMIT 1"
		const value = [election_id]
		const result = await selectQuery<Election>(pool, query, value)

		if(result.length < 1) {
			return next(new NotFoundError())
		}

		res.status(200).json({election: result[0]})
	} catch (error) {
		return next(error)
	}
}

export async function deleteElection(req: Request, res:Response, next: NextFunction) {
	try {
		const election_id = req.params.id

		if (!election_id) {
			return next(new BadRequestError())
		}

		const query = "UPDATE elections SET deleted_at = CURRENT_TIMESTAMP WHERE election_id = ? LIMIT 1";
		const value = [election_id]

		const result = await updateQuery(pool, query, value)
		if (result.affectedRows < 1) {
			return next(new InternalServerError())
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
			return next(new InternalServerError())
		}

		res.status(200).end()

	} catch (error) {
		next(error)
	}
}