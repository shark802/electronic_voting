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
exports.incrementCandidateVoteCount = exports.saveVote = exports.isVoted = void 0;
const query_1 = require("./query");
const database_1 = require("../config/database");
function isVoted(userId, electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const getUserVoteHistory = yield (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM votes WHERE voter_id = ? AND election_id = ?", [userId, electionId]);
        return getUserVoteHistory.length > 0; // return true if the result is not zero, false otherwise
    });
}
exports.isVoted = isVoted;
function saveVote(connection, selectedCandidateObject, userId, electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const placeholders = Object.keys(selectedCandidateObject).map(() => "(?, ?, ?, ?)").join(", ");
        const insertParameters = Object.entries(selectedCandidateObject).reduce((params, [position, candidateId]) => {
            params.push(userId, candidateId, position, electionId);
            return params;
        }, []);
        const prepareStatement = `INSERT INTO votes (voter_id, candidate_id, position, election_id) VALUES ${placeholders}`;
        yield connection.execute(prepareStatement, insertParameters);
        return;
    });
}
exports.saveVote = saveVote;
function incrementCandidateVoteCount(connection, selectedCandidates, electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const candidateIdNumber of Object.values(selectedCandidates)) {
            const [selectResult] = yield connection.execute("SELECT * FROM candidates WHERE id_number = ? AND election_id = ? FOR UPDATE", [candidateIdNumber, electionId]);
            if (selectResult.length === 0)
                throw new Error(`Candidate with id ${candidateIdNumber} and election id ${electionId} not found`);
            const [updateResult] = yield connection.execute("UPDATE candidates SET vote_count = vote_count + 1 WHERE id_number = ? AND election_id = ?", [candidateIdNumber, electionId]);
            if (updateResult.affectedRows === 0)
                throw new Error(`Failed to update vote count for candidate id ${candidateIdNumber} and election id ${electionId}`);
        }
    });
}
exports.incrementCandidateVoteCount = incrementCandidateVoteCount;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGF0YV9hY2Nlc3Mvdm90ZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsbUNBQXNDO0FBRXRDLGlEQUEwQztBQUkxQyxTQUFzQixPQUFPLENBQUMsTUFBYyxFQUFFLFVBQWtCOztRQUM1RCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFPLGVBQUksRUFBRSw0REFBNEQsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzdJLE9BQU8sa0JBQWtCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLHlEQUF5RDtJQUNuRyxDQUFDO0NBQUE7QUFIRCwwQkFHQztBQUVELFNBQXNCLFFBQVEsQ0FBQyxVQUEwQixFQUFFLHVCQUErQyxFQUFFLE1BQWMsRUFBRSxVQUFrQjs7UUFDMUksTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFL0YsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxFQUFFLEVBQUU7WUFDeEcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN2RCxPQUFPLE1BQU0sQ0FBQztRQUNsQixDQUFDLEVBQUUsRUFBVyxDQUFDLENBQUM7UUFFaEIsTUFBTSxnQkFBZ0IsR0FBRyw0RUFBNEUsWUFBWSxFQUFFLENBQUM7UUFFcEgsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDN0QsT0FBTztJQUNYLENBQUM7Q0FBQTtBQVpELDRCQVlDO0FBRUQsU0FBc0IsMkJBQTJCLENBQUMsVUFBMEIsRUFBRSxrQkFBMEMsRUFBRSxVQUFrQjs7UUFDeEksS0FBSyxNQUFNLGlCQUFpQixJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDO1lBRWhFLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQWtCLDZFQUE2RSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNqTCxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQztnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixpQkFBaUIsb0JBQW9CLFVBQVUsWUFBWSxDQUFDLENBQUM7WUFFakksTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBa0IsMkZBQTJGLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQy9MLElBQUksWUFBWSxDQUFDLFlBQVksS0FBSyxDQUFDO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELGlCQUFpQixvQkFBb0IsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUU1SixDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBVkQsa0VBVUMifQ==