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
exports.programHeadDashboardVoteTallyPage = exports.programHeadDashboardOverviewPage = void 0;
const database_1 = require("../../config/database");
const query_1 = require("../../data_access/query");
// import { Program } from "../../utils/enums/program";
// import { Position } from "../../utils/enums/position";
// import { CANDIDATE_POSITION } from "../../config/constants/CandidatePosition";
// import { DEPARTMENT } from "../../config/constants/BccDepartments";
function programHeadDashboardOverviewPage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userSession = req.session.user;
            if (!userSession)
                return res.redirect('/?redirectMessage=You need to login first');
            const [user] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM users WHERE id_number = ?', [userSession.user_id]);
            const elections = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE is_close = 0 AND deleted_at IS NULL ORDER BY date_start, time_start');
            const electionIdList = elections.map(election => election.election_id);
            let populationPerProgram = [];
            if (electionIdList.length > 0) {
                populationPerProgram = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM program_populations WHERE election_id IN ( ? )', [electionIdList]);
            }
            res.render("program/dashboard_overview_program_head", { elections, user, populationPerProgram });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.programHeadDashboardOverviewPage = programHeadDashboardOverviewPage;
// TODO
function programHeadDashboardVoteTallyPage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userSession = req.session.user;
            if (!userSession)
                return res.redirect('/?redirectMessage=You need to login first');
            const [user] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM users WHERE id_number = ?', [userSession.user_id]);
            const elections = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE is_close = 0 AND deleted_at IS NULL ORDER BY date_start, time_start');
            const candidatePosition = (yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM positions WHERE deleted_at IS NULL')).map(position => position.position);
            const programs = (yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL')).map(department => department.department_code);
            const electionIdList = elections.map(election => election.election_id);
            let candidates = [];
            if (electionIdList.length > 0) {
                candidates = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM candidates WHERE election_id IN ( ? ) AND deleted IS NULL', [electionIdList]);
            }
            res.render('program/dashboard-vote-tally-program-head', { elections, candidatePosition, programs, candidates, user });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.programHeadDashboardVoteTallyPage = programHeadDashboardVoteTallyPage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3JhbUhlYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL2NvbnRyb2xsZXJzL3Byb2dyYW1IZWFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG9EQUE2QztBQUM3QyxtREFBc0Q7QUFLdEQsdURBQXVEO0FBQ3ZELHlEQUF5RDtBQUN6RCxpRkFBaUY7QUFDakYsc0VBQXNFO0FBRXRFLFNBQXNCLGdDQUFnQyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQ2xHLElBQUksQ0FBQztZQUNELE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxXQUFXO2dCQUFFLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1lBQ25GLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBTyxlQUFJLEVBQUUseUNBQXlDLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUUvRyxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBVyxlQUFJLEVBQUUsbUdBQW1HLENBQUMsQ0FBQztZQUV6SixNQUFNLGNBQWMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksb0JBQW9CLEdBQWMsRUFBRSxDQUFBO1lBRXhDLElBQUksY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDNUIsb0JBQW9CLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQUMsZUFBSSxFQUFFLDhEQUE4RCxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQTtZQUNwSSxDQUFDO1lBRUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyx5Q0FBeUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1FBRXJHLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hCLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFwQkQsNEVBb0JDO0FBRUQsT0FBTztBQUNQLFNBQXNCLGlDQUFpQyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQ25HLElBQUksQ0FBQztZQUNELE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxXQUFXO2dCQUFFLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1lBQ25GLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBTyxlQUFJLEVBQUUseUNBQXlDLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUUvRyxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBVyxlQUFJLEVBQUUsbUdBQW1HLENBQUMsQ0FBQztZQUN6SixNQUFNLGlCQUFpQixHQUFHLENBQUMsTUFBTSxJQUFBLG1CQUFXLEVBQVcsZUFBSSxFQUFFLGtEQUFrRCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckosTUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFNLElBQUEsbUJBQVcsRUFBYSxlQUFJLEVBQUUsb0RBQW9ELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUUzSixNQUFNLGNBQWMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksVUFBVSxHQUFjLEVBQUUsQ0FBQTtZQUU5QixJQUFJLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQzVCLFVBQVUsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBQyxlQUFJLEVBQUUseUVBQXlFLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFBO1lBQ3JJLENBQUM7WUFFRCxHQUFHLENBQUMsTUFBTSxDQUFDLDJDQUEyQyxFQUFFLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtRQUN6SCxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNmLENBQUM7SUFFTCxDQUFDO0NBQUE7QUF0QkQsOEVBc0JDIn0=