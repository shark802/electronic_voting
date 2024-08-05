import { NextFunction, Request, Response } from "express";
import { BadRequestError, ConflictError } from "../../utils/customErrors";
import { incrementCandidateVoteCount, isVoted, saveVote } from "../../data_access/voteService";
import { pool } from "../../config/database";

export async function saveVoteFunction(req: Request, res: Response, next: NextFunction) {
    try {
        const { electionId, selectedCandidate } = req.body;
        const user_id = req.session.user!.user_id;
        // const user_id = '2021116418';

        if (!electionId) throw new BadRequestError('Election ID is missing');
        if (!selectedCandidate || typeof selectedCandidate !== 'object' || Object.keys(selectedCandidate).length === 0) throw new BadRequestError('Selected candidate data is missing or invalid');

        const hasVoted = await isVoted(user_id, electionId);
        if (hasVoted) throw new ConflictError("You have already voted!");

        // Start transaction for saving vote and updating candidate vote count.
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            await saveVote(connection, selectedCandidate, user_id, electionId);
            await incrementCandidateVoteCount(connection, selectedCandidate, electionId)
            await connection.commit();

            res.status(200).json({ message: "Vote saved!" });
        } catch (error) {
            await connection.rollback();
            next(error);

        } finally {
            connection.release();
        }

    } catch (error) {
        next(error);
    }
}
