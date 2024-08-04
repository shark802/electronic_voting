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
exports.saveVoteFunction = void 0;
const customErrors_1 = require("../../utils/customErrors");
const voteService_1 = require("../../data_access/voteService");
const database_1 = require("../../config/database");
function saveVoteFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { electionId, selectedCandidate } = req.body;
            // const user_id = req.session.user!.user_id;
            const user_id = '2021116418';
            if (!electionId)
                throw new customErrors_1.BadRequestError('Election ID is missing');
            if (!selectedCandidate || typeof selectedCandidate !== 'object' || Object.keys(selectedCandidate).length === 0)
                throw new customErrors_1.BadRequestError('Selected candidate data is missing or invalid');
            const connection = yield database_1.pool.getConnection();
            try {
                yield connection.beginTransaction();
                yield (0, voteService_1.saveVote)(connection, selectedCandidate, user_id, electionId);
                // more operation here
                res.send({ message: "Vote saved!" });
            }
            catch (error) {
                yield connection.rollback();
                next(error);
            }
            finally {
                connection.release();
            }
        }
        catch (error) {
            next(error);
        }
    });
}
exports.saveVoteFunction = saveVoteFunction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvdm90ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSwyREFBMkQ7QUFDM0QsK0RBQXlEO0FBQ3pELG9EQUE2QztBQUU3QyxTQUFzQixnQkFBZ0IsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUNsRixJQUFJLENBQUM7WUFDRCxNQUFNLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNuRCw2Q0FBNkM7WUFDN0MsTUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDO1lBRTdCLElBQUksQ0FBQyxVQUFVO2dCQUFFLE1BQU0sSUFBSSw4QkFBZSxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLGlCQUFpQixJQUFJLE9BQU8saUJBQWlCLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQztnQkFBRSxNQUFNLElBQUksOEJBQWUsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1lBRTNMLE1BQU0sVUFBVSxHQUFHLE1BQU0sZUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBRTlDLElBQUksQ0FBQztnQkFDRCxNQUFNLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUNwQyxNQUFNLElBQUEsc0JBQVEsRUFBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUNuRSxzQkFBc0I7Z0JBRXRCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztZQUN6QyxDQUFDO1lBQ0QsT0FBTyxLQUFLLEVBQUUsQ0FBQztnQkFDWCxNQUFNLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hCLENBQUM7b0JBQ08sQ0FBQztnQkFDTCxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDekIsQ0FBQztRQUNMLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hCLENBQUM7SUFDTCxDQUFDO0NBQUE7QUE1QkQsNENBNEJDIn0=