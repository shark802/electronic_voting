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
exports.getUserCandidateData = exports.updateCandidateStatus = exports.getCandidateById = exports.getManageCandidates = exports.deleteCandidateFunction = exports.updateCandidateFunction = exports.addCandidateFunction = void 0;
const customErrors_1 = require("../../utils/customErrors");
const database_1 = require("../../config/database");
const query_1 = require("../../data_access/query");
const ulid_1 = require("ulid");
const candidateService_1 = require("../../data_access/candidateService");
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
// Will response the candidate information according to candidates id_number parse in url query params
function getUserCandidateData(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const candidateIdNumberList = req.query.id_number;
            const candidateIdList = Array.isArray(candidateIdNumberList) ? candidateIdNumberList : [candidateIdNumberList];
            candidateIdList.map(id => {
                if (!id)
                    throw new customErrors_1.BadRequestError('Canidate is not provided!');
            });
            const userCandidate = yield (0, candidateService_1.getUserCandidate)(candidateIdList);
            return res.status(200).send(userCandidate);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getUserCandidateData = getUserCandidateData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuZGlkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9jb250cm9sbGVycy9jYW5kaWRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsMkRBQXlGO0FBQ3pGLG9EQUE2QztBQUM3QyxtREFBZ0Y7QUFFaEYsK0JBQTRCO0FBRTVCLHlFQUFzRTtBQUV0RSxTQUFzQixvQkFBb0IsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUN0RixJQUFJLENBQUM7WUFDRCxJQUFJLEVBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFFN0YsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLFFBQVE7Z0JBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSw4QkFBZSxDQUFDLHFEQUFxRCxDQUFDLENBQUMsQ0FBQztZQUVwTCxNQUFNLG9CQUFvQixHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFZLGVBQUksRUFBRSx5Q0FBeUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDeEgsSUFBSSxvQkFBb0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ2xDLCtCQUErQjtnQkFDL0IsTUFBTSxVQUFVLEdBQUcsTUFBTSxlQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQzlDLElBQUksQ0FBQztvQkFDRCxNQUFNLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO29CQUNwQyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsK0VBQStFLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFB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