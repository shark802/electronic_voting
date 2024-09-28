import { QueryResult, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { Election } from "../utils/types/Election";
import { selectQuery } from "./query";
import { DEPARTMENT } from "../config/constants/BccDepartments";
import { ProgramPopulations } from "../utils/types/ProgramPopulations";

export async function getElectionInfoById(electionId: string) {
    const [election] = await selectQuery<Election>(pool, 'SELECT * FROM elections WHERE election_id = ? AND deleted_at IS NULL', [electionId]);
    return election;
}

export async function getCandidatesTotalTally(electionId: string) {

    const sqlQuery = `
        SELECT c.position, c.party, c.department, MAX(c.candidate_profile) AS candidate_profile, u.id_number, u.lastname, u.firstname, u.course, v.election_id, COUNT(v.candidate_id) AS vote_count
        FROM candidates c
        LEFT JOIN votes v ON c.id_number = v.candidate_id AND v.election_id = c.election_id
        LEFT JOIN users u ON u.id_number = c.id_number     
        WHERE c.election_id = ? 
        GROUP BY c.position, u.id_number, u.lastname, u.firstname, u.course, v.election_id, c.party, c.department
        ORDER BY vote_count DESC;
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

// export async function totalUserVotedPerProgram() {
//     const sqlQuery = `
//         SELECT e.election_id, u.course, COUNT(DISTINCT v.voter_id) AS total_voted
//         FROM elections e
//         JOIN votes v ON e.election_id = v.election_id
//         JOIN users u ON v.voter_id = u.id_number
//         WHERE e.is_close = 0
//         GROUP BY e.election_id, u.course;
//     `
//     const totalVoted = await selectQuery<RowDataPacket[]>(pool, sqlQuery);
//     return totalVoted
// }

export async function getDepartmentsTotalPopulation(electionIdArray: string[]) {

    // Index for departments_votes object
    type DepartmentCode = keyof typeof DEPARTMENT;

    // shape of object that summarize all department votes per election
    type ElectionDepartmentTotalPopulation = {
        election_id: string;
        department_total_population: Record<DepartmentCode, number>;
    };

    const sqlQuery = `SELECT * FROM program_populations WHERE election_id = ? AND program_code = ?`

    const electionDepartmentTotalPopulation: ElectionDepartmentTotalPopulation[] = []; // will accumulate all elections vote summary per department
    for (const electionId of electionIdArray) {

        const departmentTotalPopulation: ElectionDepartmentTotalPopulation = {
            election_id: electionId,
            department_total_population: {} as Record<DepartmentCode, number>
        }

        for (const departmentCode of Object.keys(DEPARTMENT)) {
            const [result] = await selectQuery<ProgramPopulations>(pool, sqlQuery, [electionId, departmentCode]);

            departmentTotalPopulation.department_total_population[departmentCode as DepartmentCode] = (result ? result.program_population : 0);
        }

        electionDepartmentTotalPopulation.push(departmentTotalPopulation);
    }

    return electionDepartmentTotalPopulation;
}

export async function getDepartmentsTotalVotes(electionIdArray: string[]) {

    // type for select query return result
    type queryResultType = {
        total_voted: number;
        election_id: string;
    };

    // Index for departments_votes object
    type DepartmentCode = keyof typeof DEPARTMENT;

    // shape of object that summarize all department votes per election
    type ElectionDepartmentVoteSummary = {
        election_id: string;
        department_votes: Record<DepartmentCode, number>;
    };

    const sqlQuery = `
        SELECT COUNT(DISTINCT v.voter_id) as total_voted, v.election_id
        FROM votes v
        LEFT JOIN users u
        ON v.voter_id = u.id_number
        WHERE u.course IN (?) AND v.election_id = ?
        GROUP BY v.election_id
    `;

    const departmentVotesSummary: ElectionDepartmentVoteSummary[] = []; // will accumulate all elections vote summary per department

    for (const electionId of electionIdArray) {

        const electionDepartmentVoteSummary: ElectionDepartmentVoteSummary = {
            election_id: electionId as string,
            department_votes: {} as Record<DepartmentCode, number> // Initialized as an empty object with correct type
        };

        for (const [departmentCode, programList] of Object.entries(DEPARTMENT)) {
            const [result] = await selectQuery<queryResultType>(pool, sqlQuery, [programList, electionId]);

            // Cast departmentCode to DepartmentCode type
            electionDepartmentVoteSummary.department_votes[departmentCode as DepartmentCode] = result ? result.total_voted : 0;
        }

        departmentVotesSummary.push(electionDepartmentVoteSummary);
    }

    return departmentVotesSummary;

}