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
            const course = "IS";
            const election_id = "01J3MP1NC8AVWD5ZDXMHDGDCPA";
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
            console.log(candidatePositionList);
            console.log(candidateList);
            return res.render('voter/voteBallot', { course, candidatePositionList, candidateList });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.renderElectionBallot = renderElectionBallot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL2NvbnRyb2xsZXJzL3ZvdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUV0RCxvREFBNkM7QUFDN0MseURBQXNEO0FBRXRELFNBQXNCLFlBQVksQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUM5RSxJQUFJLENBQUM7WUFDRCxNQUFNLEtBQUssR0FBRyx3RkFBd0YsQ0FBQztZQUN2RyxNQUFNLFlBQVksR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBVyxlQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFOUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxFQUFDLFlBQVksRUFBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDZixDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBVEQsb0NBU0M7QUFFRCxTQUFzQixvQkFBb0IsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUN0RixJQUFJLENBQUM7WUFDRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDcEIsTUFBTSxXQUFXLEdBQUcsNEJBQTRCLENBQUM7WUFFakQsTUFBTSxRQUFRLEdBQUc7Ozs7Ozs7U0FPaEIsQ0FBQTtZQUNELE1BQU0sYUFBYSxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFDLGVBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0scUJBQXFCLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLENBQUM7WUFFdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFM0IsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLEVBQUMsTUFBTSxFQUFFLHFCQUFxQixFQUFFLGFBQWEsRUFBQyxDQUFDLENBQUM7UUFDMUYsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQXZCRCxvREF1QkMifQ==