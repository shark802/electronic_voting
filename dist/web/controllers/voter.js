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
const isValidTimeToVote_1 = require("../../utils/isValidTimeToVote");
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
            // const election_id = req.query.election_id;
            const sqlQuery = `
        SELECT u.id_number, u.firstname, u.lastname , u.course, c.alias, c.position
        FROM users u JOIN candidates c
        ON u.id_number = c.id_number
        WHERE c.election_id = ?
        AND c.enabled = 1
        AND c.deleted IS NULL
        `;
            const [[user], [election], candidateList] = yield Promise.all([
                (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM users WHERE id_number = ?", [id_number]),
                (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM elections WHERE election_id = ? AND deleted_at IS NULL", [election_id]),
                (0, query_1.selectQuery)(database_1.pool, sqlQuery, [election_id])
            ]);
            const candidatePositionList = Object.values(position_1.Position);
            if (!(0, isValidTimeToVote_1.isValidTimeToVote)(election))
                return res.redirect("/election?redirectMessage='Voting is currently closed'");
            return res.render('voter/voteBallot', { user, candidatePositionList, candidateList, election });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.renderElectionBallot = renderElectionBallot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL2NvbnRyb2xsZXJzL3ZvdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUV0RCxvREFBNkM7QUFDN0MseURBQXNEO0FBRXRELHFFQUFrRTtBQUVsRSxTQUFzQixZQUFZLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7UUFDOUUsSUFBSSxDQUFDO1lBQ0QsTUFBTSxLQUFLLEdBQUcsd0ZBQXdGLENBQUM7WUFDdkcsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQVcsZUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRTlELEdBQUcsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsRUFBQyxZQUFZLEVBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2YsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQVRELG9DQVNDO0FBRUQsU0FBc0Isb0JBQW9CLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7UUFDdEYsSUFBSSxDQUFDO1lBQ0QsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFLLENBQUMsT0FBTyxDQUFDO1lBQzVDLE1BQU0sV0FBVyxHQUFHLDRCQUE0QixDQUFDO1lBQ2pELDZDQUE2QztZQUU3QyxNQUFNLFFBQVEsR0FBRzs7Ozs7OztTQU9oQixDQUFBO1lBQ0QsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxhQUFhLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7Z0JBQzFELElBQUEsbUJBQVcsRUFBTyxlQUFJLEVBQUUseUNBQXlDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDL0UsSUFBQSxtQkFBVyxFQUFXLGVBQUksRUFBRSxzRUFBc0UsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNsSCxJQUFBLG1CQUFXLEVBQUMsZUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQzdDLENBQUMsQ0FBQztZQUNILE1BQU0scUJBQXFCLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLENBQUM7WUFFdEQsSUFBSSxDQUFDLElBQUEscUNBQWlCLEVBQUMsUUFBUSxDQUFDO2dCQUFFLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyx3REFBd0QsQ0FBQyxDQUFBO1lBRS9HLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxFQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztRQUNsRyxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQixDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBM0JELG9EQTJCQyJ9