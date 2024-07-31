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
exports.renderElectionBallot = exports.electionPage = void 0;
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const position_1 = require("../../utils/enums/position");
function electionPage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = "SELECT * FROM elections WHERE deleted_at IS NULL AND is_active = 1 ORDER BY date_start";
            const electionList = yield (0, query_1.selectQuery)(database_1.pool, query);
            res.render("voter/electionPage", { electionList });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.electionPage = electionPage;
function renderElectionBallot(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id_number = req.session.user.user_id;
            const election_id = "01J3MP1NC8AVWD5ZDXMHDGDCPA";
            const [user] = yield (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM users WHERE id_number = ?", [id_number]);
            console.log(user);
            const sqlQuery = `
        SELECT u.id_number, u.firstname, u.lastname , u.course, c.alias, c.position
        FROM users u JOIN candidates c
        ON u.id_number = c.id_number
        WHERE c.election_id = ?
        AND c.enabled = 1
        AND c.deleted IS NULL
        `;
            const candidateList = yield (0, query_1.selectQuery)(database_1.pool, sqlQuery, [election_id]);
            const candidatePositionList = Object.values(position_1.Position);
            return res.render('voter/voteBallot', { user, candidatePositionList, candidateList });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.renderElectionBallot = renderElectionBallot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL2NvbnRyb2xsZXJzL3ZvdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUV0RCxvREFBNkM7QUFDN0MseURBQXNEO0FBR3RELFNBQXNCLFlBQVksQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUM5RSxJQUFJLENBQUM7WUFDRCxNQUFNLEtBQUssR0FBRyx3RkFBd0YsQ0FBQztZQUN2RyxNQUFNLFlBQVksR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBVyxlQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFOUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxFQUFDLFlBQVksRUFBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDZixDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBVEQsb0NBU0M7QUFFRCxTQUFzQixvQkFBb0IsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUN0RixJQUFJLENBQUM7WUFDRCxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUssQ0FBQyxPQUFPLENBQUM7WUFDNUMsTUFBTSxXQUFXLEdBQUcsNEJBQTRCLENBQUM7WUFFakQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFPLGVBQUksRUFBRSx5Q0FBeUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFFckcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVsQixNQUFNLFFBQVEsR0FBRzs7Ozs7OztTQU9oQixDQUFBO1lBQ0QsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQUMsZUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdkUsTUFBTSxxQkFBcUIsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFRLENBQUMsQ0FBQztZQUV0RCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsRUFBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUUsYUFBYSxFQUFDLENBQUMsQ0FBQztRQUN4RixDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQixDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBeEJELG9EQXdCQyJ9