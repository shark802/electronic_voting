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
exports.generalSettings = exports.fetchUser = exports.viewRegisterDevice = exports.reviewRegisterDevice = exports.departmentPrograms = exports.manageDepartment = exports.manageVoter = exports.addCandidate = exports.manageCandidate = exports.renderAdminElectionResult = exports.viewElectionHistory = exports.commpleteElectionResult = exports.editElection = exports.newElection = exports.viewElection = exports.electionAnalytics = exports.dashboardVoteTally = exports.dashboardOverview = void 0;
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const voterService_1 = require("../../data_access/voterService");
const election_1 = require("../../data_access/election");
const checkElectionTimeStatus_1 = require("../../utils/checkElectionTimeStatus");
const customErrors_1 = require("../../utils/customErrors");
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
            // get all positions
            const positions = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM positions WHERE deleted_at IS NULL');
            const candidatePosition = positions.map(position => position.position);
            // get all departments
            const departments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
            const programs = departments.map(department => department.department_code);
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
function electionAnalytics(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.render("admin/dashboard_analytics");
        }
        catch (error) {
            next(error);
        }
    });
}
exports.electionAnalytics = electionAnalytics;
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
function commpleteElectionResult(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const electionId = req.params.id;
            const election = yield (0, election_1.getElectionInfoById)(electionId);
            const departments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM program_populations WHERE election_id = ?', [electionId]);
            res.render('admin/complete_election_report', { election, departments });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.commpleteElectionResult = commpleteElectionResult;
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
            const positions = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM positions WHERE deleted_at IS NULL');
            const positionList = positions.map(position => position.position);
            const departmentData = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
            const departments = departmentData.map(department => department.department_code);
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
            const candidatePositions = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM positions WHERE deleted_at IS NULL');
            const positions = candidatePositions.map(position => position.position);
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
            const candidatePositions = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM positions WHERE deleted_at IS NULL');
            const positions = candidatePositions.map(position => position.position);
            const departments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
            const programs = departments.map(department => department.department_code);
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
// Department
function manageDepartment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const departments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
            res.render("admin/department_manage", { departments });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.manageDepartment = manageDepartment;
function departmentPrograms(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const departments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
            const programs = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM programs WHERE deleted_at IS NULL');
            res.render("admin/department_programs", { departments, programs });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.departmentPrograms = departmentPrograms;
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
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const departmentData = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
            const programs = departmentData.map(department => department.department_code);
            res.render("admin/control-panel-user", { programs });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.fetchUser = fetchUser;
function generalSettings(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const departments = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
            res.render("admin/control-panel-general-settings", { departments });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.generalSettings = generalSettings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL2NvbnRyb2xsZXJzL2FkbWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUV0RCxvREFBNkM7QUFFN0MsaUVBQXdLO0FBQ3hLLHlEQUEwRjtBQUMxRixpRkFBc0U7QUFDdEUsMkRBQTBFO0FBSzFFLFNBQXNCLGlCQUFpQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQ25GLElBQUksQ0FBQztZQUVELE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFXLGVBQUksRUFBRSxtR0FBbUcsQ0FBQyxDQUFDO1lBRXpKLE1BQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdkUsSUFBSSxvQkFBb0IsR0FBYyxFQUFFLENBQUE7WUFFeEMsSUFBSSxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUM1QixvQkFBb0IsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBQyxlQUFJLEVBQUUsOERBQThELEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFBO1lBQ3BJLENBQUM7WUFFRCxHQUFHLENBQUMsTUFBTSxDQUFDLDBCQUEwQixFQUFFLEVBQUUsU0FBUyxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQTtRQUMvRSxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNmLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFoQkQsOENBZ0JDO0FBRUQsU0FBc0Isa0JBQWtCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7UUFDcEYsSUFBSSxDQUFDO1lBQ0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQVcsZUFBSSxF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