import { eventEmitter } from './../../events/globalEventEmitterInstance';
import { NextFunction, Request, Response } from "express";
import { BadRequestError, ConflictError } from "../../utils/customErrors";
import { checkIfUserHasVoted, incrementCandidateVoteCount, saveVote, updateVoterVoteStatus } from "../../data_access/voteService";
import { pool } from "../../config/database";
import { Socket } from "socket.io";
import { Candidate } from "../../utils/types/Candidate";
import { selectQuery } from "../../data_access/query";
import { User } from "../../utils/types/User";
import { DEPARTMENT } from "../../config/constants/BccDepartments";

// type Course = (typeof DEPARTMENT[keyof typeof DEPARTMENT])[number]

export async function saveVoteFunction(req: Request, res: Response, next: NextFunction) {
    try {
        const { electionId } = req.body;
        const selectedCandidate: Pick<Candidate, 'id_number' | 'position'>[] = req.body.selectedCandidate
        const user_id = req.session.user!.user_id;
        // const [user] = await selectQuery<User>(pool, 'SELECT * FROM users WHERE id_number = ?', [user_id]);
        // const voterDepartment = Object.entries(DEPARTMENT).find(([key, value]) =>
        //     value.includes(user.course as Course)
        // )?.[0]; // Get the key directly if found

        const socket: Socket = res.locals.socket;

        if (!electionId) throw new BadRequestError('Election ID is missing');
        if (!selectedCandidate || typeof selectedCandidate !== 'object' || Object.keys(selectedCandidate).length === 0) throw new BadRequestError('Selected candidate data is missing or invalid');

        const hasVoted = await checkIfUserHasVoted(user_id, electionId);
        if (hasVoted) throw new ConflictError("You have already voted!");

        // Start transaction for saving vote and updating candidate vote count.
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            await saveVote(connection, selectedCandidate, user_id, electionId);
            await incrementCandidateVoteCount(connection, selectedCandidate, electionId);
            await updateVoterVoteStatus(connection, user_id, electionId);
            await connection.commit();

            // this event emitter emit a new-vote event that will trigger to send email with the user_id pass
            eventEmitter.emit('new-vote', user_id, electionId);

            //broadcast an event when new vote saved for to update the dashboard realtime
            socket.emit('new-vote', {
                election_id: electionId,
                voter_id: user_id,
                voted_candidate_list: selectedCandidate.map(candidate => {
                    return {
                        candidate_id: candidate.id_number,
                        candidate_position: candidate.position
                    }
                })
            });

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
