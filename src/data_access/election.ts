import { pool } from "../config/database";
import { Election } from "../utils/types/Election";
import { selectQuery } from "./query";

export async function getElectionInfoById(electionId: string) {
    const [election] = await selectQuery<Election>(pool, 'SELECT * FROM elections WHERE election_id = ? AND deleted_at IS NULL', [electionId]);
    return election;
}

export async function getCandidatesTotalTally(electionId: string) {
    const sqlQuery = `
        SELECT u.id_number, u.firstname, u.lastname, u.course, v.position, COUNT(*) as vote_count
        FROM users u
        JOIN votes v
        ON u.id_number = v.candidate_id
        WHERE election_id = ?
        GROUP BY v.candidate_id, v.position
    `
    const candidatesVoteTally = await selectQuery(pool, sqlQuery, [electionId]);
    return candidatesVoteTally;
}