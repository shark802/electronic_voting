"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUser = exports.viewRegisterDevice = exports.reviewRegisterDevice = exports.manageVoter = exports.addCandidate = exports.manageCandidate = exports.newElection = exports.viewElection = exports.dashboardVoteTally = exports.dashboardOverview = void 0;
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
    try {
        res.render("admin/election_view");
    }
    catch (error) {
        next(error);
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL2NvbnRyb2xsZXJzL2FkbWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLFNBQWdCLGlCQUFpQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7SUFDN0UsSUFBSSxDQUFDO1FBQ0QsR0FBRyxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0lBQzFDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2YsQ0FBQztBQUNMLENBQUM7QUFORCw4Q0FNQztBQUVELFNBQWdCLGtCQUFrQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7SUFDOUUsSUFBSSxDQUFDO1FBQ0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO0lBQzVDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2YsQ0FBQztBQUNMLENBQUM7QUFORCxnREFNQztBQUVELFdBQVc7QUFDWCxTQUFnQixZQUFZLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtJQUN4RSxJQUFJLENBQUM7UUFDRCxHQUFHLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUE7SUFDckMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDZixDQUFDO0FBQ0wsQ0FBQztBQU5ELG9DQU1DO0FBRUQsU0FBZ0IsV0FBVyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7SUFDdkUsSUFBSSxDQUFDO1FBQ0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0lBQ3ZDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2YsQ0FBQztBQUNMLENBQUM7QUFORCxrQ0FNQztBQUVELFlBQVk7QUFDWixTQUFnQixlQUFlLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtJQUMzRSxJQUFJLENBQUM7UUFDRCxHQUFHLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUE7SUFDeEMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDZixDQUFDO0FBQ0wsQ0FBQztBQU5ELDBDQU1DO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7SUFDeEUsSUFBSSxDQUFDO1FBQ0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0lBQ3JDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2YsQ0FBQztBQUNMLENBQUM7QUFORCxvQ0FNQztBQUVELFFBQVE7QUFDUixTQUFnQixXQUFXLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtJQUV2RSxJQUFJLENBQUM7UUFDRCxHQUFHLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUE7SUFDcEMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDZixDQUFDO0FBQ0wsQ0FBQztBQVBELGtDQU9DO0FBRUQsa0JBQWtCO0FBQ2xCLFNBQWdCLG9CQUFvQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7SUFFaEYsSUFBSSxDQUFDO1FBQ0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0lBQzlDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2YsQ0FBQztBQUNMLENBQUM7QUFQRCxvREFPQztBQUVELFNBQWdCLGtCQUFrQixDQUFDLEdBQVksRUFBRSxHQUFZLEVBQUUsSUFBa0I7SUFFN0UsSUFBSSxDQUFDO1FBQ0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO0lBQ2xELENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2YsQ0FBQztBQUNMLENBQUM7QUFQRCxnREFPQztBQUVELGdCQUFnQjtBQUNoQixTQUFnQixTQUFTLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtJQUVyRSxJQUFJLENBQUM7UUFDRCxHQUFHLENBQUMsTUFBTSxDQUFDLGdDQUFnQyxDQUFDLENBQUE7SUFDaEQsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDZixDQUFDO0FBQ0wsQ0FBQztBQVBELDhCQU9DIn0=