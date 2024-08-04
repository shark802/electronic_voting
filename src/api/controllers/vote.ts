import { NextFunction, Request, Response } from "express";
import { BadRequestError, ConflictError } from "../../utils/customErrors";
import { saveVote } from "../../data_access/voteService";
import { pool } from "../../config/database";
import { Vote } from "../../utils/types/Votes";
import { selectQuery } from "../../data_access/query";

export async function saveVoteFunction(req: Request, res: Response, next: NextFunction) {
    try {
        const { electionId, selectedCandidate } = req.body;
        // const user_id = req.session.user!.user_id;
        const user_id = '2021116418';

        if (!electionId) throw new BadRequestError('Election ID is missing');
        if (!selectedCandidate || typeof selectedCandidate !== 'object' || Object.keys(selectedCandidate).length === 0) throw new BadRequestError('Selected candidate data is missing or invalid');

        const getUserVoteHistory = await selectQuery<Vote>(pool, "SELECT * FROM votes WHERE voter_id = ? AND election_id = ?", [user_id, electionId]);
        if (getUserVoteHistory.length > 0) throw new ConflictError("You have already voted!");

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
