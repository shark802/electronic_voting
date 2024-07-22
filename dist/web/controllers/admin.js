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
exports.fetchUser = exports.viewRegisterDevice = exports.reviewRegisterDevice = exports.manageVoter = exports.addCandidate = exports.manageCandidate = exports.viewElectionHistory = exports.deleteElection = exports.editElection = exports.newElection = exports.viewElection = exports.dashboardVoteTally = exports.dashboardOverview = void 0;
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const position_1 = require("../../utils/enums/position");
const program_1 = require("../../utils/enums/program");
function dashboardOverview(req, res, next) {
    try {
        res.render("admin/dashboard_overview");
    }
    catch (error) {
        next(error);
    }
}
exports.dashboardOverview = dashboardOverview;
function dashboardVoteTally(req, res, next) {
    try {
        res.render("admin/dashboard_vote_tally");
    }
    catch (error) {
        next(error);
    }
}
exports.dashboardVoteTally = dashboardVoteTally;
// Election
function viewElection(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = "SELECT * FROM elections WHERE deleted_at IS NULL AND (date_end > CURDATE() OR (date_end = CURDATE() AND time_end > CURTIME())) ORDER BY created_at DESC";
            const elections = yield (0, query_1.selectQuery)(database_1.pool, query);
            res.render("admin/election_view", { elections });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.viewElection = viewElection;
function newElection(req, res, next) {
    try {
        res.render("admin/election_create");
    }
    catch (error) {
        next(error);
    }
}
exports.newElection = newElection;
function editElection(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const election_id = req.params.id;
            const query = "SELECT * FROM elections WHERE election_id = ?";
            const election = yield (0, query_1.selectQuery)(database_1.pool, query, [election_id]);
            res.render("admin/election_edit", { election: election[0] });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.editElection = editElection;
;
function deleteElection(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
        }
        catch (error) {
            next(error);
        }
    });
}
exports.deleteElection = deleteElection;
function viewElectionHistory(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = "SELECT * FROM elections WHERE (date_end < CURDATE() OR (date_end = CURDATE() AND time_end < CURTIME())) AND deleted_at IS NULL ORDER BY date_end DESC, time_end DESC";
            const elections = yield (0, query_1.selectQuery)(database_1.pool, query);
            res.render("admin/election_history", { elections });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.viewElectionHistory = viewElectionHistory;
// Candidate
function manageCandidate(req, res, next) {
    try {
        res.render("admin/candidate_manage");
    }
    catch (error) {
        next(error);
    }
}
exports.manageCandidate = manageCandidate;
function addCandidate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = "SELECT * FROM elections WHERE deleted_at IS NULL AND (date_start > CURDATE() OR (date_start = CURDATE() AND time_start > CURTIME())) ORDER BY created_at DESC";
            const electionList = yield (0, query_1.selectQuery)(database_1.pool, query);
            const positions = Object.values(position_1.Position);
            const programs = Object.values(program_1.Program);
            res.render("admin/candidate_add", { electionList, positions, programs });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.addCandidate = addCandidate;
// Voter
function manageVoter(req, res, next) {
    try {
        res.render("admin/voter_manage");
    }
    catch (error) {
        next(error);
    }
}
exports.manageVoter = manageVoter;
// Register device
function reviewRegisterDevice(req, res, next) {
    try {
        res.render("admin/register_device_review");
    }
    catch (error) {
        next(error);
    }
}
exports.reviewRegisterDevice = reviewRegisterDevice;
function viewRegisterDevice(req, res, next) {
    try {
        res.render("admin/register_device_registered");
    }
    catch (error) {
        next(error);
    }
}
exports.viewRegisterDevice = viewRegisterDevice;
// Control Panel
function fetchUser(req, res, next) {
    try {
        res.render("admin/control-panel_fetch-user");
    }
    catch (error) {
        next(error);
    }
}
exports.fetchUser = fetchUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL2NvbnRyb2xsZXJzL2FkbWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUV0RCxvREFBNkM7QUFDN0MseURBQXNEO0FBQ3RELHVEQUFvRDtBQUVwRCxTQUFnQixpQkFBaUIsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO0lBQzdFLElBQUksQ0FBQztRQUNELEdBQUcsQ0FBQyxNQUFNLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtJQUMxQyxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNmLENBQUM7QUFDTCxDQUFDO0FBTkQsOENBTUM7QUFFRCxTQUFnQixrQkFBa0IsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO0lBQzlFLElBQUksQ0FBQztRQUNELEdBQUcsQ0FBQyxNQUFNLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNmLENBQUM7QUFDTCxDQUFDO0FBTkQsZ0RBTUM7QUFFRCxXQUFXO0FBQ1gsU0FBc0IsWUFBWSxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQzlFLElBQUksQ0FBQztZQUNELE1BQU0sS0FBSyxHQUFHLHlKQUF5SixDQUFDO1lBQ3hLLE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFXLGVBQUksRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUUxRCxHQUFHLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLEVBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQTtRQUNsRCxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNo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