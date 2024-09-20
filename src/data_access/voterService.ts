import { RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { selectQuery } from "./query";
import { User } from "../utils/types/User";
import { Voter } from "../utils/types/Voter";

export async function getAllVoterInElection(electionId: string) {
    const selectAllVoterQuery = `
        SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section, v.election_id, v.voted
        FROM users u
        JOIN voters v
        ON u.id_number = v.id_number
        WHERE v.election_id = ?
        ORDER BY u.lastname
        `;

    type voterUser = Partial<User> & Partial<Voter>
    const voters = await selectQuery<voterUser>(pool, selectAllVoterQuery, [electionId]);

    return voters;
}

// Select all recent log of user voted in the system
export async function getAllRecentUsersVoted() {
    const selectAllVotedQuery = `
                SELECT * FROM (
                    SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section, v.election_id, MIN(v.time_casted) AS time_casted, e.election_name
                    FROM users u
                    JOIN votes v ON u.id_number = v.voter_id
                    JOIN elections e ON v.election_id = e.election_id
                    GROUP BY v.election_id, u.id_number
                ) AS subquery
                ORDER BY time_casted DESC
                LIMIT 50;`

    return await selectQuery(pool, selectAllVotedQuery);
}

// Select all recent user voted in one specific election
export async function getAllRecentUsersVotedInElection(electionId: string) {
    const selectAllVotedByElectionQuery = `
                SELECT * FROM (
                    SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section, v.election_id, MIN(v.time_casted) AS time_casted, e.election_name
                    FROM users u
                    JOIN votes v ON u.id_number = v.voter_id
                    JOIN elections e ON v.election_id = e.election_id
                    WHERE v.election_id = ?
                    GROUP BY v.election_id, u.id_number
                ) AS subquery
                ORDER BY time_casted DESC
                LIMIT 50;`

    return await selectQuery(pool, selectAllVotedByElectionQuery, [electionId]);
}

// function for finding voter base on id_number and election_id provided
export async function findOneUserVotedInElection(electionId: string, userId: string) {
    const findOneUserVotedInElectionQuery = `
                SELECT * FROM (
                    SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section, v.election_id, MIN(v.time_casted) AS time_casted, e.election_name
                    FROM users u
                    JOIN votes v ON u.id_number = v.voter_id
                    JOIN elections e ON v.election_id = e.election_id
                    WHERE v.election_id = ? AND u.id_number = ?
                    GROUP BY v.election_id, u.id_number
                ) AS subquery
                ORDER BY time_casted DESC
                LIMIT 50;`

    return await selectQuery(pool, findOneUserVotedInElectionQuery, [electionId, userId])
}

// Select all election that user participated or voted in
export async function getAllUserElectionParticipatedIn(userId: string) {
    const getAllUserElectionParticipatedQuery = `
                SELECT * FROM (
                    SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section, v.election_id, MIN(v.time_casted) AS time_casted, e.election_name
                    FROM users u
                    JOIN votes v ON u.id_number = v.voter_id
                    JOIN elections e ON v.election_id = e.election_id
                    WHERE u.id_number = ?
                    GROUP BY v.election_id, u.id_number
                ) AS subquery
                ORDER BY time_casted DESC
                LIMIT 50;`

    return await selectQuery(pool, getAllUserElectionParticipatedQuery, [userId])
}

// Count all total voter for election
export async function countAllQualifiedVoterForElection() {
    const year_active = new Date().getFullYear();

    interface TotalPopulation extends RowDataPacket {
        total_population: number
    }

    const [totalPopulation] = await selectQuery<TotalPopulation>(pool, 'SELECT COUNT(*) as total_population FROM users WHERE year_active = ?', [year_active]);
    return totalPopulation.total_population;

}

// select all voters not voted in specific election
export async function getAllNotVotedInElection(electionId: string) {

    const sqlQuery = `
        SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section 
        FROM voters v
        JOIN users u
        ON v.id_number = u.id_number
        WHERE v.election_id = ? AND v.voted = 0
        ORDER BY u.lastname
    `
    type voterUser = Pick<User, 'firstname' | 'lastname' | 'id_number' | 'course' | 'year_level' | 'section'>

    const voters = await selectQuery<voterUser>(pool, sqlQuery, [electionId]);

    return voters;
}