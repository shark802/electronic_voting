import { Request, Response, NextFunction } from "express";
import { BadRequestError, ConflictError, NotFoundError } from '../../utils/customErrors';
import { pool } from "../../config/database";
import { insertQuery, selectQuery, updateQuery } from "../../data_access/query";
import { Candidate } from "../../utils/types/Candidate";
import { ulid } from "ulid";
import { User } from "../../utils/types/User";
import { getUserCandidate } from "../../data_access/candidateService";

export async function addCandidateFunction(req: Request, res: Response, next: NextFunction) {
    try {
        let { election_id, id_number, firstname, lastname, course, alias, party, position } = req.body;

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
        const findCandidateIfExist = await selectQuery<Candidate>(pool, "SELECT * FROM candidates WHERE id_number = ? AND election_id = ? AND deleted IS NULL", [id_number, election_id]);
        if (findCandidateIfExist.length > 0) return next(new ConflictError(`Unable to add ${id_number} in election due to conflict, candidate already exist`));

        const candidate_id = ulid();
        const addNewCandidateQuery = "INSERT INTO candidates (candidate_id, id_number, position, alias, party, election_id) VALUES (?, ?, ?, ?, ?, ?)";
        const candidateParameter = [candidate_id, id_number, position, alias, party, election_id];
        const newCandidate = await insertQuery(pool, addNewCandidateQuery, candidateParameter);

        if (newCandidate.affectedRows > 0) {
            return res.status(201).json({ message: "New candidate successfully added" });
        }
    } catch (error) {
        next(error);
    }
}

export async function updateCandidateFunction(req: Request, res: Response, next: NextFunction) {
    try {
        const candidate_id = req.params.id;
        if (!candidate_id) return next(new BadRequestError("Election Id is missing"));

        let { alias, party, position } = req.body;
        if (!alias || !party || !position) return next(new BadRequestError("Candidate is lacking some information to proceed update"));

        const updateSqlQuery = "UPDATE candidates SET alias = ?, party = ?, position = ? WHERE candidate_id = ? AND deleted IS NULL";
        const updateParameter = [alias, party, position, candidate_id];

        const updateResult = await updateQuery(pool, updateSqlQuery, updateParameter);
        if (updateResult.affectedRows < 0) return next(new NotFoundError('Resource not found or no changes were made'));

        return res.status(200).json({ message: 'Candidate updated successfully' });

    } catch (error) {
        return next(error);
    }
}

export async function deleteCandidateFunction(req: Request, res: Response, next: NextFunction) {
    try {
        const candidate_id = req.params.id;
        if (!candidate_id) throw new BadRequestError("Failed to delete candidate due to missing candidate's id");

        const deleteQuery = 'UPDATE candidates SET deleted = CURDATE() WHERE candidate_id = ? AND deleted IS NULL';

        const deleteResult = await updateQuery(pool, deleteQuery, [candidate_id]);
        if (deleteResult.affectedRows < 1) throw new NotFoundError('Deletion failed, no changes were made');

        return res.status(200).json({ message: `Candidate deleted successfully` });

    } catch (error) {
        next(error);
    }
}

export async function getManageCandidates(req: Request, res: Response, next: NextFunction) {
    try {
        const position = req.query.position;
        const electionIds = req.query.election_id;
        const electionList = Array.isArray(electionIds) ? electionIds : [electionIds];

        if (!position || !electionList) throw new BadRequestError('No election Available');

        type userCandidate = Pick<User, "id_number" | 'firstname' | 'lastname' | 'year_level' | 'section' | 'course'> & Pick<Candidate, 'candidate_id' | 'election_id' | 'position' | 'enabled' | 'alias' | 'party'>;

        const sqlSelectUserCandidateQuery = `
        SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section, c.candidate_id, c.election_id, c.position, c.enabled, c.alias, c.party, c.added_at
        FROM users u JOIN candidates c
        ON u.id_number = c.id_number
        WHERE c.position = ?
        AND c.election_id IN (?)
        AND c.deleted IS NULL
        ORDER BY u.lastname;
        `
        const userCandidateResult = await selectQuery<userCandidate>(pool, sqlSelectUserCandidateQuery, [position, electionList]);
        return res.status(200).json(userCandidateResult);

    } catch (error) {
        next(error)
    }
};

export async function getCandidateById(req: Request, res: Response, next: NextFunction) {
    try {
        const candidate_id = req.params.id;
        if (!candidate_id) throw new BadRequestError("Candidate Id is missing");

        const sqlQuery = `SELECT u.firstname, u.lastname, u.course, c.* FROM candidates c JOIN users u  ON c.id_number = u.id_number WHERE c.candidate_id = ? AND c.deleted IS NULL`
        const candidate = await selectQuery<Candidate>(pool, sqlQuery, [candidate_id]);

        if (candidate.length < 1) throw new NotFoundError("Candidate Not Found");
        res.status(200).send(candidate[0]);
    } catch (error) {
        next(error)
    }
}

export async function updateCandidateStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const candidate_id = req.params.id
        const status = req.body.status;
        if (!status || !candidate_id) throw new BadRequestError("Required value is missing can't update candidate");

        const sqlQuery = "UPDATE candidates SET enabled = ? WHERE candidate_id = ?";
        const parameter = [status, candidate_id];
        const result = await updateQuery(pool, sqlQuery, parameter);

        if (result.affectedRows < 1) throw new NotFoundError('No resource updated');

        res.status(200).json({ message: `Candidate status updated` });
    } catch (error) {
        next(error)
    }
}

// Will response the candidate information according to candidates id_number parse in url query params
export async function getUserCandidateData(req: Request, res: Response, next: NextFunction) {
    try {
        const candidateIdNumberList = req.query.id_number;
        const candidateIdList = Array.isArray(candidateIdNumberList) ? candidateIdNumberList : [candidateIdNumberList];

        candidateIdList.map(id => {
            if (!id) throw new BadRequestError('Canidate is not provided!');
        })

        const userCandidate = await getUserCandidate(candidateIdList as string[]);
        return res.status(200).send(userCandidate);

    } catch (error) {
        next(error);
    }
}