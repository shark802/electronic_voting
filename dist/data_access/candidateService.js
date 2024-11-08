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
exports.getUserCandidate = void 0;
const database_1 = require("../config/database");
const query_1 = require("./query");
function getUserCandidate(candidateIdList, electionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sqlSelectUserCandidateQuery = `
        SELECT u.id_number, u.firstname, u.lastname, u.course, u.year_level, u.section, c.candidate_id, c.election_id, c.position, c.enabled, c.party, c.added_at
        FROM users u JOIN candidates c
        ON u.id_number = c.id_number
        WHERE u.id_number IN (?)
        AND election_id = ?
        AND c.deleted IS NULL
        ORDER BY u.lastname;
        `;
        const userCandidateResult = yield (0, query_1.selectQuery)(database_1.pool, sqlSelectUserCandidateQuery, [candidateIdList, electionId]);
        return userCandidateResult;
    });
}
exports.getUserCandidate = getUserCandidate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuZGlkYXRlU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kYXRhX2FjY2Vzcy9jYW5kaWRhdGVTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGlEQUEwQztBQUcxQyxtQ0FBc0M7QUFFdEMsU0FBc0IsZ0JBQWdCLENBQUMsZUFBeUIsRUFBRSxVQUFrQjs7UUFHaEYsTUFBTSwyQkFBMkIsR0FBRzs7Ozs7Ozs7U0FRL0IsQ0FBQTtRQUNMLE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQWdCLGVBQUksRUFBRSwyQkFBMkIsRUFBRSxDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQy9ILE9BQU8sbUJBQW1CLENBQUE7SUFDOUIsQ0FBQztDQUFBO0FBZEQsNENBY0MifQ==