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
