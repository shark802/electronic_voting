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
exports.fetchUser = exports.viewRegisterDevice = exports.reviewRegisterDevice = exports.manageVoter = exports.addCandidate = exports.manageCandidate = exports.renderAdminElectionResult = exports.viewElectionHistory = exports.editElection = exports.newElection = exports.viewElection = exports.dashboardVoteTally = exports.dashboardOverview = void 0;
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const program_1 = require("../../utils/enums/program");
const voterService_1 = require("../../data_access/voterService");
const election_1 = require("../../data_access/election");
const checkElectionTimeStatus_1 = require("../../utils/checkElectionTimeStatus");
const customErrors_1 = require("../../utils/customErrors");
const CandidatePosition_1 = require("../../config/constants/CandidatePosition");
const BccDepartments_1 = require("../../config/constants/BccDepartments");
function dashboardOverview(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const elections = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE is_close = 0 AND deleted_at IS NULL ORDER BY date_start, time_start');
            const electionIdList = elections.map(election => election.election_id);
            let populationPerProgram = [];
            if (electionIdList.length > 0) {
                populationPerProgram = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM program_populations WHERE election_id IN ( ? )', [electionIdList]);
            }
            res.render("admin/dashboard_overview", { elections, populationPerProgram });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.dashboardOverview = dashboardOverview;
function dashboardVoteTally(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const elections = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM elections WHERE is_close = 0 AND deleted_at IS NULL ORDER BY date_start, time_start');
            const candidatePosition = Object.values(CandidatePosition_1.CANDIDATE_POSITION);
            const programs = Object.keys(BccDepartments_1.DEPARTMENT);
            const electionIdList = elections.map(election => election.election_id);
            let candidates = [];
            if (electionIdList.length > 0) {
                candidates = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM candidates WHERE election_id IN ( ? ) AND deleted IS NULL', [electionIdList]);
            }
            res.render("admin/dashboard_vote_tally", { elections, candidatePosition, programs, candidates });
        }
        catch (error) {
            next(error);
        }
    });
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
function renderAdminElectionResult(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const electionId = req.params.id;
            if (!electionId)
                throw new customErrors_1.BadRequestError('Election id is missing');
            // retrieve election here
            const electionInfo = yield (0, election_1.getElectionInfoById)(electionId);
            if (!electionInfo)
                throw new customErrors_1.NotFoundError('Election not exist');
            // check if the election has ended
            if (!(0, checkElectionTimeStatus_1.isElectionEnded)(electionInfo))
                return res.redirect('/election?redirectMessage=Result Not Available Yet');
            const positionList = Object.values(CandidatePosition_1.CANDIDATE_POSITION);
            const departments = Object.keys(BccDepartments_1.DEPARTMENT);
            const candidatesVoteTally = yield (0, election_1.getCandidatesTotalTally)(electionId);
            return res.render('admin/electionResultForAdmin', { candidatesVoteTally, positionList, departments, electionInfo });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.renderAdminElectionResult = renderAdminElectionResult;
// Candidate
function manageCandidate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const positions = Object.values(CandidatePosition_1.CANDIDATE_POSITION);
            const selectElectioQuery = "SELECT * FROM elections WHERE deleted_at IS NULL AND (date_end > CURDATE() OR (date_end = CURDATE() AND time_end >= CURTIME()))";
            const elections = yield (0, query_1.selectQuery)(database_1.pool, selectElectioQuery);
            // const elections: Election[] = []
            res.render("admin/candidate_manage", { elections, positions });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.manageCandidate = manageCandidate;
function addCandidate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = "SELECT * FROM elections WHERE deleted_at IS NULL AND (date_start > CURDATE() OR (date_start = CURDATE() AND time_start > CURTIME())) ORDER BY created_at DESC";
            const electionList = yield (0, query_1.selectQuery)(database_1.pool, query);
            const positions = Object.values(CandidatePosition_1.CANDIDATE_POSITION);
            const programs = Object.keys(BccDepartments_1.DEPARTMENT);
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
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { election, user_id } = req.query;
            let votedUsers;
            if (election && user_id) {
                votedUsers = yield (0, voterService_1.findOneUserVotedInElection)(election, user_id);
            }
            else if (election && !user_id) {
                votedUsers = yield (0, voterService_1.getAllRecentUsersVotedInElection)(election);
            }
            else if (user_id && !election) {
                votedUsers = yield (0, voterService_1.getAllUserElectionParticipatedIn)(user_id);
            }
            else {
                votedUsers = yield (0, voterService_1.getAllRecentUsersVoted)();
            }
            const availableElectionQuery = "SELECT * FROM elections WHERE (date_start < NOW() OR (date_start = CURDATE() AND time_start < CURTIME())) AND deleted_at IS NULL ORDER BY date_end DESC, time_end DESC   LIMIT 10";
            const availableElections = yield (0, query_1.selectQuery)(database_1.pool, availableElectionQuery);
            res.render("admin/voter_manage", { votedUsers, availableElections });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.manageVoter = manageVoter;
// Register device
function reviewRegisterDevice(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const devices = yield (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM register_devices WHERE is_registered = 0 AND deleted_at IS NULL ORDER BY date_created DESC");
            res.render("admin/register_device_review", { devices });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.reviewRegisterDevice = reviewRegisterDevice;
function viewRegisterDevice(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const registeredDevices = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM register_devices WHERE is_registered = 1 AND deleted_at IS NULL ORDER BY updated_at DESC');
            res.render("admin/register_device_registered", { registeredDevices });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.viewRegisterDevice = viewRegisterDevice;
// Control Panel
function fetchUser(req, res, next) {
    try {
        const programs = Object.values(program_1.Program);
        res.render("admin/control-panel-user", { programs });
    }
    catch (error) {
        next(error);
    }
}
exports.fetchUser = fetchUser;
