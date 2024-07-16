import { Request, Response, NextFunction } from "express";
import { BadRequestError, ConflictError, NotFoundError } from "../../utils/customErrors";
import { pool } from "../../config/database";
import { insertQuery, selectQuery, updateQuery } from "../../data_access/query";
import { Candidate } from "../../utils/types/Candidate";
import { ulid } from "ulid";

export async function addCandidateFunction(req: Request, res: Response, next: NextFunction) {
    try {
        let {election_id, id_number, firstname, lastname, course, alias, party, position} = req.body;
        
        if (!election_id || !id_number || !firstname || !lastname || !alias || !party || !position) return next(new BadRequestError("Cannot proceed adding candidate due to missing info"));

        const findCandidateAccount = await selectQuery<Candidate>(pool, "SELECT * FROM users WHERE id_number = ?", [id_number]);
        if (findCandidateAccount.length < 1) {
            // create account for candidate
            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();
                await connection.execute("INSERT INTO users (id_number, firstname, lastname, course) VALUES(?, ?, ?, ?)", [id_number, firstname, lastname, course]);
                await connection.execute("INSERT INTO roles (id_number, voter) VALUES(?, ?)", [id_number, 1]);
                await connection.commit();        
            } catch (error) {
                connection.rollback();
                return next(error);
            }
        }
        const findCandidateIfExist = await selectQuery<Candidate>(pool,"SELECT * FROM candidates WHERE id_number = ? AND election_id = ? AND deleted IS NULL", [id_number, election_id]);
        if (findCandidateIfExist.length > 0) return next(new ConflictError(`Unable to add ${id_number} in election due to conflict, candidate already exist`));
        
        const candidate_id = ulid();
        const addNewCandidateQuery = "INSERT INTO candidates (candidate_id, id_number, position, alias, party, election_id) VALUES (?, ?, ?, ?, ?, ?)";
        const candidateParameter = [candidate_id, id_number, position, alias, party, election_id];
        const newCandidate = await insertQuery(pool, addNewCandidateQuery, candidateParameter);

        if(newCandidate.affectedRows > 0) {
            return res.status(201).json({message: "New candidate successfully added"});
        }
    } catch (error) {
        next(error);
    }
}

export async function updateCandidateFunction(req: Request, res: Response, next: NextFunction) {
    try {
        const candidate_id = req.params.id;
        if (!candidate_id) return next(new BadRequestError("Election Id is missing"));

        let {alias, party, position, enabled} = req.body;
        if (!alias || !party || !position || !enabled) return next(new BadRequestError("Candidate is lacking some information to proceed update"));

        const updateSqlQuery = "UPDATE candidates SET alias = ?, party = ?, position = ?, enabled = ? WHERE candidate_id = ? AND deleted IS NULL";
        const updateParameter = [alias, party, position, enabled, candidate_id];

        const updateResult = await updateQuery(pool, updateSqlQuery, updateParameter);
        if (updateResult.affectedRows < 0) return next(new NotFoundError('Resource not found or no changes were made'));

        return res.status(200).json({message: 'Resource updated successfully'});
        
    } catch (error) {
        return next(error);
    }
}