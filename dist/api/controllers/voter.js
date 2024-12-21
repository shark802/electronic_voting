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
exports.getAllVoterElectionHistory = void 0;
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const customErrors_1 = require("../../utils/customErrors");
function getAllVoterElectionHistory(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            if (!userId)
                throw new customErrors_1.BadRequestError('User id is missing');
            const sqlQuery = `
            SELECT DISTINCT e.election_name, e.election_id, e.date_start, e.time_start, v.voted, e.date_end, v.voting_mode, e.time_end, MIN(votes.time_casted) as time_casted
            FROM voters v 
            LEFT JOIN elections e ON v.election_id = e.election_id
            LEFT JOIN votes ON votes.election_id = v.election_id AND votes.voter_id = v.id_number
            WHERE id_number = ? AND e.deleted_at IS NULL
            GROUP BY e.election_id, e.election_name, e.date_start, e.time_start, v.voted, e.date_end, e.time_end, votes.voter_id, v.voting_mode
            ORDER BY e.date_start DESC, e.time_start DESC;
        `;
            const voterElectionHistory = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [userId]);
            res.status(200).json({ voterElectionHistory });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getAllVoterElectionHistory = getAllVoterElectionHistory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL2NvbnRyb2xsZXJzL3ZvdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUN0RCxvREFBNkM7QUFDN0MsMkRBQTJEO0FBRTNELFNBQXNCLDBCQUEwQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQzVGLElBQUksQ0FBQztZQUNELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxNQUFNO2dCQUFFLE1BQU0sSUFBSSw4QkFBZSxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFFN0QsTUFBTSxRQUFRLEdBQUc7Ozs7Ozs7O1NBUWhCLENBQUE7WUFFRCxNQUFNLG9CQUFvQixHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFDLGVBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1FBRW5ELENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2YsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQXJCRCxnRUFxQkMifQ==