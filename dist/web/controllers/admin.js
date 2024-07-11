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
    try {
        res.render("admin/candidate_add");
    }
    catch (error) {
        next(error);
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL2NvbnRyb2xsZXJzL2FkbWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUV0RCxvREFBNkM7QUFFN0MsU0FBZ0IsaUJBQWlCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtJQUM3RSxJQUFJLENBQUM7UUFDRCxHQUFHLENBQUMsTUFBTSxDQUFDLDBCQUEwQixDQUFDLENBQUE7SUFDMUMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDZixDQUFDO0FBQ0wsQ0FBQztBQU5ELDhDQU1DO0FBRUQsU0FBZ0Isa0JBQWtCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtJQUM5RSxJQUFJLENBQUM7UUFDRCxHQUFHLENBQUMsTUFBTSxDQUFDLDRCQUE0QixDQUFDLENBQUE7SUFDNUMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDZixDQUFDO0FBQ0wsQ0FBQztBQU5ELGdEQU1DO0FBRUQsV0FBVztBQUNYLFNBQXNCLFlBQVksQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUM5RSxJQUFJLENBQUM7WUFDRCxNQUFNLEtBQUssR0FBRyx5SkFBeUosQ0FBQztZQUN4SyxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBVyxlQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFFMUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxFQUFDLFNBQVMsRUFBQyxDQUFDLENBQUE7UUFDbEQsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQVRE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