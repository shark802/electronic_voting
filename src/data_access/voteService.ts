import { PoolConnection } from 'mysql2/promise';

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
