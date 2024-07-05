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
exports.fetchUser = exports.viewRegisterDevice = exports.reviewRegisterDevice = exports.manageVoter = exports.addCandidate = exports.manageCandidate = exports.deleteElection = exports.editElection = exports.newElection = exports.viewElection = exports.dashboardVoteTally = exports.dashboardOverview = void 0;
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
            const query = "SELECT * FROM elections WHERE deleted_at IS NULL AND date_end >= CURDATE() ORDER BY created_at DESC";
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
            const query = "SELECT * FROM elections WHERE election_id = ? LIMIT 1";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL2NvbnRyb2xsZXJzL2FkbWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUV0RCxvREFBNkM7QUFFN0MsU0FBZ0IsaUJBQWlCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtJQUM3RSxJQUFJLENBQUM7UUFDRCxHQUFHLENBQUMsTUFBTSxDQUFDLDBCQUEwQixDQUFDLENBQUE7SUFDMUMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDZixDQUFDO0FBQ0wsQ0FBQztBQU5ELDhDQU1DO0FBRUQsU0FBZ0Isa0JBQWtCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtJQUM5RSxJQUFJLENBQUM7UUFDRCxHQUFHLENBQUMsTUFBTSxDQUFDLDRCQUE0QixDQUFDLENBQUE7SUFDNUMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDZixDQUFDO0FBQ0wsQ0FBQztBQU5ELGdEQU1DO0FBRUQsV0FBVztBQUNYLFNBQXNCLFlBQVksQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUM5RSxJQUFJLENBQUM7WUFDRCxNQUFNLEtBQUssR0FBRyxxR0FBcUcsQ0FBQztZQUNwSCxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBVyxlQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFFMUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxFQUFDLFNBQVMsRUFBQyxDQUFDLENBQUE7UUFDbEQsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQVRE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