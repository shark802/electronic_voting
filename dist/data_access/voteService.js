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
const cryptoService_1 = require("../utils/cryptoService");
function checkIfUserHasVoted(userId, electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const getUserVoteHistory = yield (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM votes WHERE voter_id = ? AND election_id = ?", [userId, electionId]);
        return getUserVoteHistory.length > 0; // return true if the result is not zero, false otherwise
    });
}
exports.checkIfUserHasVoted = checkIfUserHasVoted;
function saveVote(connection, selectedCandidateObject, userId, electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const placeholders = selectedCandidateObject.map(() => "(?, ?, ?, ?, ?)").join(", ");
        const insertParameters = selectedCandidateObject.reduce((params, candidate) => {
            const secretKey = cryptoService_1.CryptoService.secretKey();
            const iv = cryptoService_1.CryptoService.generateIv();
            const bufferIv = cryptoService_1.CryptoService.stringToBuffer(iv);
            const decryptVote = cryptoService_1.CryptoService.encrypt(candidate.id_number, secretKey, bufferIv);
            params.push(userId, decryptVote, candidate.position, iv, electionId);
            return params;
        }, []);
        const prepareStatement = `INSERT INTO votes (voter_id, candidate_id, position, encryption_iv, election_id) VALUES ${placeholders}`;
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
function updateVoterVoteStatus(connection, userId, electionId, isFaceVerified) {
    return __awaiter(this, void 0, void 0, function* () {
        const votingMode = isFaceVerified ? 'ONLINE' : 'ON-SITE';
        const [updateVoteStatusResult] = yield connection.execute('UPDATE voters SET voted = 1, voting_mode = ? WHERE id_number = ? AND election_id = ?', [votingMode, userId, electionId]);
        if (updateVoteStatusResult.affectedRows === 0)
            throw new customErrors_1.NotFoundError('Voter not Exist on this Election');
        return;
    });
}
exports.updateVoterVoteStatus = updateVoterVoteStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGF0YV9hY2Nlc3Mvdm90ZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsbUNBQXNDO0FBRXRDLGlEQUEwQztBQUUxQyx3REFBc0Q7QUFDdEQsMERBQXVEO0FBR3ZELFNBQXNCLG1CQUFtQixDQUFDLE1BQWMsRUFBRSxVQUFrQjs7UUFDeEUsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBTyxlQUFJLEVBQUUsNERBQTRELEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUM3SSxPQUFPLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyx5REFBeUQ7SUFDbkcsQ0FBQztDQUFBO0FBSEQsa0RBR0M7QUFFRCxTQUFzQixRQUFRLENBQUMsVUFBMEIsRUFBRSx1QkFBb0UsRUFBRSxNQUFjLEVBQUUsVUFBa0I7O1FBQy9KLE1BQU0sWUFBWSxHQUFHLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyRixNQUFNLGdCQUFnQixHQUFHLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRTtZQUMxRSxNQUFNLFNBQVMsR0FBRyw2QkFBYSxDQUFDLFNBQVMsRUFBRSxDQUFBO1lBQzNDLE1BQU0sRUFBRSxHQUFHLDZCQUFhLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDdEMsTUFBTSxRQUFRLEdBQUcsNkJBQWEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDakQsTUFBTSxXQUFXLEdBQUcsNkJBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFcEYsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3JFLE9BQU8sTUFBTSxDQUFDO1FBQ2xCLENBQUMsRUFBRSxFQUFXLENBQUMsQ0FBQztRQUVoQixNQUFNLGdCQUFnQixHQUFHLDJGQUEyRixZQUFZLEVBQUUsQ0FBQztRQUVuSSxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM3RCxPQUFPO0lBQ1gsQ0FBQztDQUFBO0FBakJELDRCQWlCQztBQUVELFNBQXNCLDJCQUEyQixDQUFDLFVBQTBCLEVBQUUsa0JBQStELEVBQUUsVUFBa0I7O1FBQzdKLEtBQUssTUFBTSxTQUFTLElBQUksa0JBQWtCLEVBQUUsQ0FBQztZQUV6QyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFrQiw2RUFBNkUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuTCxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQztnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixTQUFTLENBQUMsU0FBUyxvQkFBb0IsVUFBVSxZQUFZLENBQUMsQ0FBQztZQUVuSSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFrQiwyRkFBMkYsRUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNqTSxJQUFJLFlBQVksQ0FBQyxZQUFZLEtBQUssQ0FBQztnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGdEQUFnRCxTQUFTLENBQUMsU0FBUyxvQkFBb0IsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUU5SixDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBVkQsa0VBVUM7QUFFRCxTQUFzQixxQkFBcUIsQ0FBQyxVQUEwQixFQUFFLE1BQWMsRUFBRSxVQUFrQixFQUFFLGNBQW1DOztRQUUzSSxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBRXpELE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBa0Isc0ZBQXNGLEVBQUUsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDck0sSUFBSSxzQkFBc0IsQ0FBQyxZQUFZLEtBQUssQ0FBQztZQUFFLE1BQU0sSUFBSSw0QkFBYSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFFM0csT0FBTztJQUNYLENBQUM7Q0FBQTtBQVJELHNEQVFDIn0=