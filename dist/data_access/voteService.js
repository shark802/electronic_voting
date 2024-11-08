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
exports.updateVoterVoteStatus = exports.incrementCandidateVoteCount = exports.saveVote = exports.checkIfUserHasVoted = void 0;
const query_1 = require("./query");
const database_1 = require("../config/database");
const customErrors_1 = require("../utils/customErrors");
function checkIfUserHasVoted(userId, electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const getUserVoteHistory = yield (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM votes WHERE voter_id = ? AND election_id = ?", [userId, electionId]);
        return getUserVoteHistory.length > 0; // return true if the result is not zero, false otherwise
    });
}
exports.checkIfUserHasVoted = checkIfUserHasVoted;
function saveVote(connection, selectedCandidateObject, userId, electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const placeholders = selectedCandidateObject.map(() => "(?, ?, ?, ?)").join(", ");
        const insertParameters = selectedCandidateObject.reduce((params, candidate) => {
            params.push(userId, candidate.id_number, candidate.position, electionId);
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
        for (const candidate of selectedCandidates) {
            const [selectResult] = yield connection.execute("SELECT * FROM candidates WHERE id_number = ? AND election_id = ? FOR UPDATE", [candidate.id_number, electionId]);
            if (selectResult.length === 0)
                throw new Error(`Candidate with id ${candidate.id_number} and election id ${electionId} not found`);
            const [updateResult] = yield connection.execute("UPDATE candidates SET vote_count = vote_count + 1 WHERE id_number = ? AND election_id = ?", [candidate.id_number, electionId]);
            if (updateResult.affectedRows === 0)
                throw new Error(`Failed to update vote count for candidate id ${candidate.id_number} and election id ${electionId}`);
        }
    });
}
exports.incrementCandidateVoteCount = incrementCandidateVoteCount;
function updateVoterVoteStatus(connection, userId, electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const [updateVoteStatusResult] = yield connection.execute('UPDATE voters SET voted = 1 WHERE id_number = ? AND election_id = ?', [userId, electionId]);
        if (updateVoteStatusResult.affectedRows === 0)
            throw new customErrors_1.NotFoundError('Voter not Exist on this Election');
        return;
    });
}
exports.updateVoterVoteStatus = updateVoterVoteStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGF0YV9hY2Nlc3Mvdm90ZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsbUNBQXNDO0FBRXRDLGlEQUEwQztBQUUxQyx3REFBc0Q7QUFHdEQsU0FBc0IsbUJBQW1CLENBQUMsTUFBYyxFQUFFLFVBQWtCOztRQUN4RSxNQUFNLGtCQUFrQixHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFPLGVBQUksRUFBRSw0REFBNEQsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzdJLE9BQU8sa0JBQWtCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLHlEQUF5RDtJQUNuRyxDQUFDO0NBQUE7QUFIRCxrREFHQztBQUVELFNBQXNCLFFBQVEsQ0FBQyxVQUEwQixFQUFFLHVCQUFvRSxFQUFFLE1BQWMsRUFBRSxVQUFrQjs7UUFDL0osTUFBTSxZQUFZLEdBQUcsdUJBQXVCLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVsRixNQUFNLGdCQUFnQixHQUFHLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRTtZQUMxRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDekUsT0FBTyxNQUFNLENBQUM7UUFDbEIsQ0FBQyxFQUFFLEVBQVcsQ0FBQyxDQUFDO1FBRWhCLE1BQU0sZ0JBQWdCLEdBQUcsNEVBQTRFLFlBQVksRUFBRSxDQUFDO1FBRXBILE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzdELE9BQU87SUFDWCxDQUFDO0NBQUE7QUFaRCw0QkFZQztBQUVELFNBQXNCLDJCQUEyQixDQUFDLFVBQTBCLEVBQUUsa0JBQStELEVBQUUsVUFBa0I7O1FBQzdKLEtBQUssTUFBTSxTQUFTLElBQUksa0JBQWtCLEVBQUUsQ0FBQztZQUV6QyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFrQiw2RUFBNkUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuTCxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQztnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixTQUFTLENBQUMsU0FBUyxvQkFBb0IsVUFBVSxZQUFZLENBQUMsQ0FBQztZQUVuSSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFrQiwyRkFBMkYsRUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNqTSxJQUFJLFlBQVksQ0FBQyxZQUFZLEtBQUssQ0FBQztnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGdEQUFnRCxTQUFTLENBQUMsU0FBUyxvQkFBb0IsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUU5SixDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBVkQsa0VBVUM7QUFFRCxTQUFzQixxQkFBcUIsQ0FBQyxVQUEwQixFQUFFLE1BQWMsRUFBRSxVQUFrQjs7UUFFdEcsTUFBTSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFrQixxRUFBcUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3hLLElBQUksc0JBQXNCLENBQUMsWUFBWSxLQUFLLENBQUM7WUFBRSxNQUFNLElBQUksNEJBQWEsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1FBRTNHLE9BQU87SUFDWCxDQUFDO0NBQUE7QUFORCxzREFNQyJ9