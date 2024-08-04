import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { selectQuery } from './query';
import { Vote } from '../utils/types/Votes';
import { pool } from '../config/database';
import { Candidate } from '../utils/types/Candidate';


export async function isVoted(userId: string, electionId: string) {
    const getUserVoteHistory = await selectQuery<Vote>(pool, "SELECT * FROM votes WHERE voter_id = ? AND election_id = ?", [userId, electionId]);
    return getUserVoteHistory.length > 0; // return true if the result is not zero, false otherwise
}

export async function saveVote(connection: PoolConnection, selectedCandidateObject: Record<string, string>, userId: string, electionId: string) {
    const placeholders = Object.keys(selectedCandidateObject).map(() => "(?, ?, ?, ?)").join(", ");

    const insertParameters = Object.entries(selectedCandidateObject).reduce((params, [position, candidateId]) => {
        params.push(userId, candidateId, position, electionId);
        return params;
    }, [] as any[]);

    const prepareStatement = `INSERT INTO votes (voter_id, candidate_id, position, election_id) VALUES ${placeholders}`;

    await connection.execute(prepareStatement, insertParameters);
    return;
}

export async function incrementCandidateVoteCount(connection: PoolConnection, selectedCandidates: Record<string, string>, electionId: string) {
    for (const candidateIdNumber of Object.values(selectedCandidates)) {

        const [selectResult] = await connection.execute<RowDataPacket[]>("SELECT * FROM candidates WHERE id_number = ? AND election_id = ? FOR UPDATE", [candidateIdNumber, electionId]);
        if (selectResult.length === 0) throw new Error(`Candidate with id ${candidateIdNumber} and election id ${electionId} not found`);

        const [updateResult] = await connection.execute<ResultSetHeader>("UPDATE candidates SET vote_count = vote_count + 1 WHERE id_number = ? AND election_id = ?", [candidateIdNumber, electionId]);
        if (updateResult.affectedRows === 0) throw new Error(`Failed to update vote count for candidate id ${candidateIdNumber} and election id ${electionId}`);

    }
}