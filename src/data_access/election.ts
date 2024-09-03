import { RowDataPacket } from "mysql2";
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

export async function getAllCandidatesInElection(electionId: string) {
    const sqlQuery = `
        SELECT u.id_number, u.firstname, u.lastname, u.course, c.position
        FROM users u
        JOIN candidates c ON u.id_number = c.id_number
        WHERE election_id = ? AND c.deleted IS NULL AND c.enabled = 1
    `

    const candidates = await selectQuery(pool, sqlQuery, [electionId]); // Assuming selectQuery automatically binds parameters
    return candidates;
}

export async function totalUserVotedPerElection() {
    const sqlQuery = `
        SELECT e.election_id, COUNT(DISTINCT v.voter_id) AS total_voted
        FROM elections e
        JOIN votes v ON e.election_id = v.election_id
        WHERE e.is_close = 0
        GROUP BY e.election_id;
    `
    const totalVoted = await selectQuery<RowDataPacket[]>(pool, sqlQuery);
    return totalVoted
}

export async function totalUserVotedPerProgram() {
    const sqlQuery = `
        SELECT e.election_id, u.course, COUNT(DISTINCT v.voter_id) AS total_voted
        FROM elections e
        JOIN votes v ON e.election_id = v.election_id
        JOIN users u ON v.voter_id = u.id_number
        WHERE e.is_close = 0
        GROUP BY e.election_id, u.course;
    `
    const totalVoted = await selectQuery<RowDataPacket[]>(pool, sqlQuery);
    return totalVoted
}