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
exports.saveVote = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGF0YV9hY2Nlc3Mvdm90ZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUEsU0FBc0IsUUFBUSxDQUFDLFVBQTBCLEVBQUUsdUJBQStDLEVBQUUsTUFBYyxFQUFFLFVBQWtCOztRQUMxSSxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUvRixNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLEVBQUUsRUFBRTtZQUN4RyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZELE9BQU8sTUFBTSxDQUFDO1FBQ2xCLENBQUMsRUFBRSxFQUFXLENBQUMsQ0FBQztRQUVoQixNQUFNLGdCQUFnQixHQUFHLDRFQUE0RSxZQUFZLEVBQUUsQ0FBQztRQUVwSCxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM3RCxPQUFPO0lBQ1gsQ0FBQztDQUFBO0FBWkQsNEJBWUMifQ==