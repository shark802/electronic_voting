"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCandidateStatus = exports.getCandidateById = exports.getManageCandidates = exports.deleteCandidateFunction = exports.updateCandidateFunction = exports.addCandidateFunction = void 0;
const customErrors_1 = require("../../utils/customErrors");
const database_1 = require("../../config/database");
const query_1 = require("../../data_access/query");
const ulid_1 = require("ulid");
function addCandidateFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { election_id, id_number, firstname, lastname, course, alias, party, position } = req.body;
            if (!election_id || !id_number || !firstname || !lastname || !alias || !party || !position)
                return next(new customErrors_1.BadRequestError("Cannot proceed adding candidate due to missing info"));
            const findCandidateAccount = yield (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM users WHERE id_number = ?", [id_number]);
            if (findCandidateAccount.length < 1) {
                // create account for candidate
                const connection = yield database_1.pool.getConnection();
                try {
                    yield connection.beginTransaction();
                    yield connection.execute("INSERT INTO users (id_number, firstname, lastname, course) VALUES(?, ?, ?, ?)", [id_number, firstname, lastname, course]);
                    yield connection.execute("INSERT INTO roles (id_number, voter) VALUES(?, ?)", [id_number, 1]);
                    yield connection.commit();
                }
                catch (error) {
                    connection.rollback();
                    return next(error);
                }
            }
            const findCandidateIfExist = yield (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM candidates WHERE id_number = ? AND election_id = ? AND deleted IS NULL", [id_number, election_id]);
            if (findCandidateIfExist.length > 0)
                return next(new customErrors_1.ConflictError(`Unable to add ${id_number} in election due to conflict, candidate already exist`));
            const candidate_id = (0, ulid_1.ulid)();
            const addNewCandidateQuery = "INSERT INTO candidates (candidate_id, id_number, position, alias, party, election_id) VALUES (?, ?, ?, ?, ?, ?)";
            const candidateParameter = [candidate_id, id_number, position, alias, party, election_id];
            const newCandidate = yield (0, query_1.insertQuery)(database_1.pool, addNewCandidateQuery, candidateParameter);
            if (newCandidate.affectedRows > 0) {
                return res.status(201).json({ message: "New candidate successfully added" });
            }
        }
        catch (error) {
            next(error);
        }
    });
}
exports.addCandidateFunction = addCandidateFunction;
function updateCandidateFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const candidate_id = req.params.id;
            if (!candidate_id)
                return next(new customErrors_1.BadRequestError("Election Id is missing"));
            let { alias, party, position } = req.body;
            if (!alias || !party || !position)
                return next(new customErrors_1.BadRequestError("Candidate is lacking some information to proceed update"));
            const updateSqlQuery = "UPDATE candidates SET alias = ?, party = ?, position = ? WHERE candidate_id = ? AND deleted IS NULL";
            const updateParameter = [alias, party, position, candidate_id];
            const updateResult = yield (0, query_1.updateQuery)(database_1.pool, updateSqlQuery, updateParameter);
            if (updateResult.affectedRows < 0)
                return next(new customErrors_1.NotFoundError('Resource not found or no changes were made'));
            return res.status(200).json({ message: 'Candidate updated successfully' });
        }
        catch (error) {
            return next(error);
        }
    });
}
exports.updateCandidateFunction = updateCandidateFunction;
function deleteCandidateFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const candidate_id = req.params.id;
            if (!candidate_id)
                throw new customErrors_1.BadRequestError("Failed to delete candidate due to missing candidate's id");
            const deleteQuery = 'UPDATE candidates SET deleted = CURDATE() WHERE candidate_id = ? AND deleted IS NULL';
            const deleteResult = yield (0, query_1.updateQuery)(database_1.pool, deleteQuery, [candidate_id]);
            if (deleteResult.affectedRows < 1)
                throw new customErrors_1.NotFoundError('Deletion failed, no changes were made');
            return res.status(200).json({ message: `Candidate deleted successfully` });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.deleteCandidateFunction = deleteCandidateFunction;
function getManageCandidates(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const position = req.query.position;
            const electionIds = req.query.election_id;
            const electionList = Array.isArray(electionIds) ? electionIds : [electionIds];
            if (!position || !electionList)
                throw new customErrors_1.BadRequestError('No election Available');
            const sqlSelectUserCandidateQuery = `
        SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section, c.candidate_id, c.election_id, c.position, c.enabled, c.alias, c.party, c.added_at
        FROM users u JOIN candidates c
        ON u.id_number = c.id_number
        WHERE c.position = ?
        AND c.election_id IN (?)
        AND c.deleted IS NULL
        ORDER BY u.lastname;
        `;
            const userCandidateResult = yield (0, query_1.selectQuery)(database_1.pool, sqlSelectUserCandidateQuery, [position, electionList]);
            return res.status(200).json(userCandidateResult);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getManageCandidates = getManageCandidates;
;
function getCandidateById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const candidate_id = req.params.id;
            if (!candidate_id)
                throw new customErrors_1.BadRequestError("Candidate Id is missing");
            const sqlQuery = `SELECT u.firstname, u.lastname, u.course, c.* FROM candidates c JOIN users u  ON c.id_number = u.id_number WHERE c.candidate_id = ? AND c.deleted IS NULL`;
            const candidate = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [candidate_id]);
            if (candidate.length < 1)
                throw new customErrors_1.NotFoundError("Candidate Not Found");
            res.status(200).send(candidate[0]);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getCandidateById = getCandidateById;
function updateCandidateStatus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const candidate_id = req.params.id;
            const status = req.body.status;
            if (!status || !candidate_id)
                throw new customErrors_1.BadRequestError("Required value is missing can't update candidate");
            const sqlQuery = "UPDATE candidates SET enabled = ? WHERE candidate_id = ?";
            const parameter = [status, candidate_id];
            const result = yield (0, query_1.updateQuery)(database_1.pool, sqlQuery, parameter);
            if (result.affectedRows < 1)
                throw new customErrors_1.NotFoundError('No resource updated');
            res.status(200).json({ message: `Candidate status updated` });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateCandidateStatus = updateCandidateStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuZGlkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9jb250cm9sbGVycy9jYW5kaWRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsMkRBQXlGO0FBQ3pGLG9EQUE2QztBQUM3QyxtREFBZ0Y7QUFFaEYsK0JBQTRCO0FBRzVCLFNBQXNCLG9CQUFvQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQ3RGLElBQUksQ0FBQztZQUNELElBQUksRUFBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUU3RixJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUTtnQkFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLDhCQUFlLENBQUMscURBQXFELENBQUMsQ0FBQyxDQUFDO1lBRXBMLE1BQU0sb0JBQW9CLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQVksZUFBSSxFQUFFLHlDQUF5QyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4SCxJQUFJLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDbEMsK0JBQStCO2dCQUMvQixNQUFNLFVBQVUsR0FBRyxNQUFNLGVBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDOUMsSUFBSSxDQUFDO29CQUNELE1BQU0sVUFBVSxDQUFDLGdCQUFnQixFQUFFLENBQUM7b0JBQ3BDLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQywrRUFBK0UsRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxD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