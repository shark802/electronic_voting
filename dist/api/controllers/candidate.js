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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllcandidatesInActiveElection = exports.getUserCandidateData = exports.updateCandidateStatus = exports.getCandidateById = exports.getManageCandidates = exports.deleteCandidateFunction = exports.updateCandidateFunction = exports.addCandidateFunction = void 0;
const customErrors_1 = require("../../utils/customErrors");
const database_1 = require("../../config/database");
const query_1 = require("../../data_access/query");
const ulid_1 = require("ulid");
const candidateService_1 = require("../../data_access/candidateService");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function addCandidateFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            Object.entries(req.body).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    req.body[key] = value.toUpperCase();
                }
            });
            let { election_id, id_number, firstname, lastname, course, party, position } = req.body;
            const candidate_profile = req.file ? req.file.filename : null;
            if (!election_id || !id_number || !firstname || !lastname || !party || !position || !course)
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
                    yield connection.rollback();
                    return next(error);
                }
                finally {
                    yield connection.release();
                }
            }
            const findCandidateIfExist = yield (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM candidates WHERE id_number = ? AND election_id = ? AND deleted IS NULL", [id_number, election_id]);
            if (findCandidateIfExist.length > 0)
                return next(new customErrors_1.ConflictError(`Unable to add ${id_number} in election due to conflict, candidate already exist`));
            const candidate_id = (0, ulid_1.ulid)();
            const addNewCandidateQuery = "INSERT INTO candidates (candidate_id, id_number, position, party, election_id, candidate_profile, department) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const candidateParameter = [candidate_id, id_number, position, party, election_id, candidate_profile, course];
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
            let { party, position } = req.body;
            const candidateProfile = req.file ? req.file.filename : null;
            if (!party || !position)
                return next(new customErrors_1.BadRequestError("Candidate is lacking some information to proceed update"));
            // if the request comes with to update candidate profile. check if there is already a candidate profile set then delete the old profile
            if (candidateProfile) {
                const [candidate] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM candidates WHERE candidate_id = ?', [candidate_id]);
                if (candidate.candidate_profile) {
                    const oldProfilePath = path_1.default.join(__dirname, `./../../../public/img/candidate_profiles/${candidate.candidate_profile}`);
                    fs_1.default.unlink(oldProfilePath, (error) => {
                        if ((error === null || error === void 0 ? void 0 : error.code) === 'ENOENT') {
                            console.log(`Could'nt find file ${candidate.candidate_profile}, delete attempt failed`);
                        }
                    });
                }
            }
            const updateSqlQuery = "UPDATE candidates SET party = ?, position = ?, candidate_profile = ? WHERE candidate_id = ? AND deleted IS NULL";
            const updateParameter = [party, position, candidateProfile, candidate_id];
            const updateResult = yield (0, query_1.updateQuery)(database_1.pool, updateSqlQuery, updateParameter);
            if (updateResult.affectedRows < 0)
                return next(new customErrors_1.NotFoundError('Resource not found or no changes were made'));
            return res.status(200).json({ message: 'Candidate updated successfully' });
        }
        catch (error) {
            console.log('invalid image');
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
            if (!position)
                throw new customErrors_1.BadRequestError('No election Available');
            if (!electionIds)
                throw new customErrors_1.BadRequestError('Atleast 1 election Id is required');
            const electionList = Array.isArray(electionIds) ? electionIds : [electionIds];
            const sqlSelectUserCandidateQuery = `
        SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section, c.candidate_id, c.election_id, c.position, c.enabled, c.party, c.added_at
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
            const electionId = req.query.electionId;
            const candidateIdNumberList = req.query.id_number;
            if (!electionId)
                throw new customErrors_1.BadRequestError("Election Id is not provided");
            if (!candidateIdNumberList)
                throw new customErrors_1.BadRequestError('Please select a candidate!');
            const candidateIdList = Array.isArray(candidateIdNumberList) ? candidateIdNumberList : [candidateIdNumberList];
            const userCandidate = yield (0, candidateService_1.getUserCandidate)(candidateIdList, electionId);
            return res.status(200).send(userCandidate);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getUserCandidateData = getUserCandidateData;
//! TODO dashboard vote tally
function getAllcandidatesInActiveElection(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sqlQuery = `
            SELECT u.id_number, u.firstname, u.lastname, u.course, c.position, c.department, e.election_id, c.vote_count
            FROM candidates c
            JOIN elections e ON c.election_id = e.election_id
            LEFT JOIN users u ON c.id_number = u.id_number
            LEFT JOIN votes v ON c.id_number = v.candidate_id AND e.election_id = v.election_id
            WHERE e.deleted_at IS NULL AND e.is_close = 0 AND c.deleted IS NULL AND c.enabled = 1
            GROUP BY c.election_id, u.id_number, c.position, v.election_id, c.department, c.vote_count
            ORDER BY lastname
        `;
            const candidatesData = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery);
            res.status(200).json({ candidatesData });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getAllcandidatesInActiveElection = getAllcandidatesInActiveElection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuZGlkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9jb250cm9sbGVycy9jYW5kaWRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMkRBQXlGO0FBQ3pGLG9EQUE2QztBQUM3QyxtREFBZ0Y7QUFFaEYsK0JBQTRCO0FBRTVCLHlFQUFzRTtBQUN0RSw0Q0FBb0I7QUFDcEIsZ0RBQXdCO0FBRXhCLFNBQXNCLG9CQUFvQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQ3RGLElBQUksQ0FBQztZQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7Z0JBQzlDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFLENBQUM7b0JBQzVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUN4QyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUN4RixNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFFOUQsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLE1BQU07Z0JBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSw4QkFBZSxD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