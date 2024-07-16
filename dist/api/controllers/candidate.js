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
exports.addCandidateFunction = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuZGlkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9jb250cm9sbGVycy9jYW5kaWRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsMkRBQTBFO0FBQzFFLG9EQUE2QztBQUM3QyxtREFBbUU7QUFFbkUsK0JBQTRCO0FBRTVCLFNBQXNCLG9CQUFvQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQ3RGLElBQUksQ0FBQztZQUNELElBQUksRUFBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUU3RixJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUTtnQkFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLDhCQUFlLENBQUMscURBQXFELENBQUMsQ0FBQyxDQUFDO1lBRXBMLE1BQU0sb0JBQW9CLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQVksZUFBSSxFQUFFLHlDQUF5QyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4SCxJQUFJLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDbEMsK0JBQStCO2dCQUMvQixNQUFNLFVBQVUsR0FBRyxNQUFNLGVBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDOUMsSUFBSSxDQUFDO29CQUNELE1BQU0sVUFBVSxDQUFDLGdCQUFnQixFQUFFLENBQUM7b0JBQ3BDLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQywrRUFBK0UsRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ3BKLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxtREFBbUQsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5RixNQUFNLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDOUIsQ0FBQztnQkFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO29CQUNiLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDdEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBWSxlQUFJLEVBQUMsc0ZBQXNGLEVBQUUsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNqTCxJQUFJLG9CQUFvQixDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksNEJBQWEsQ0FBQyxpQkFBaUIsU0FBUyx1REFBdUQsQ0FBQyxDQUFDLENBQUM7WUFFdkosTUFBTSxZQUFZLEdBQUcsSUFBQSxXQUFJLEdBQUUsQ0FBQztZQUM1QixNQUFNLG9CQUFvQixHQUFHLGlIQUFpSCxDQUFDO1lBQy9JLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxZQUFZLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzFGLE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFDLGVBQUksRUFBRSxvQkFBb0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1lBRXZGLElBQUcsWUFBWSxDQUFDLFlBQVksR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDL0IsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxrQ0FBa0MsRUFBQyxDQUFDLENBQUM7WUFDL0UsQ0FBQztRQUNMLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hCLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFsQ0Qsb0RBa0NDIn0=