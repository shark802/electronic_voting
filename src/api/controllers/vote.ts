import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../utils/customErrors";
import { saveVote } from "../../data_access/voteService";
import { pool } from "../../config/database";

export async function saveVoteFunction(req: Request, res: Response, next: NextFunction) {
    try {
        const { electionId, selectedCandidate } = req.body;
        // const user_id = req.session.user!.user_id;
        const user_id = '2021116418';

        if (!electionId) throw new BadRequestError('Election ID is missing');
        if (!selectedCandidate || typeof selectedCandidate !== 'object' || Object.keys(selectedCandidate).length === 0) throw new BadRequestError('Selected candidate data is missing or invalid');

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();
            await saveVote(connection, selectedCandidate, user_id, electionId);
            // more operation here

            res.send({ message: "Vote saved!" });
        }
        catch (error) {
            await connection.rollback();
            next(error);
        }
        finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
}
