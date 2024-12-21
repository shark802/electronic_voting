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
const cryptoService_1 = require("../../utils/cryptoService");
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
            let candidates = [];
            let positionName = [];
            if (elections.length > 0) {
                candidates = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM candidates WHERE election_id IN(?) AND deleted IS NULL AND enabled = 1', [elections.map(election => election.election_id)]);
                const positions = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM positions WHERE deleted_at IS NULL');
                positionName = positions.map(position => position.position);
            }
            res.render("admin/election_view", { elections, candidates, positions: positionName });
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
            let candidates = [];
            let positionName = [];
            if (elections.length > 0) {
                candidates = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM candidates WHERE election_id IN(?) AND deleted IS NULL AND enabled = 1', [elections.map(election => election.election_id)]);
                const positions = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM positions WHERE deleted_at IS NULL');
                positionName = positions.map(position => position.position);
            }
            res.render("admin/election_history", { elections, candidates, positions: positionName });
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
            const electionInfo = yield (0, election_1.getElectionInfoById)(electionId);
            if (!electionInfo)
                throw new customErrors_1.NotFoundError('Election not exist');
            if (!(0, checkElectionTimeStatus_1.isElectionEnded)(electionInfo))
                return res.redirect('/election?redirectMessage=Result Not Available Yet');
            const positions = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM positions WHERE deleted_at IS NULL');
            const positionList = positions.map(position => position.position);
            const departmentData = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
            const departments = departmentData.map(department => department.department_code);
            const electionResult = yield (0, election_1.getElectionResult)(electionId);
            let candidatesVoteTally;
            if (!electionResult) {
                candidatesVoteTally = yield (0, election_1.generateElectionResult)(electionId);
            }
            else {
                const secretKey = cryptoService_1.CryptoService.secretKey();
                const iv = cryptoService_1.CryptoService.stringToBuffer(electionResult.encryption_iv);
                const decryptResult = cryptoService_1.CryptoService.decrypt(electionResult.result, secretKey, iv);
                candidatesVoteTally = JSON.parse(decryptResult);
            }
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
            const { election, user_id, page } = req.query;
            let votedUsers = [];
            // Fetch all voted users based on filters
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
            // Pagination logic
            const limit = 30;
            const currentPage = parseInt(page) || 1;
            const totalUsers = votedUsers.length;
            const totalPages = Math.ceil(totalUsers / limit);
            const startIndex = (currentPage - 1) * limit;
            const paginatedUsers = votedUsers.slice(startIndex, startIndex + limit);
            const availableElectionQuery = "SELECT * FROM elections WHERE (date_start < NOW() OR (date_start = CURDATE() AND time_start < CURTIME())) AND deleted_at IS NULL ORDER BY date_end DESC, time_end DESC";
            const availableElections = yield (0, query_1.selectQuery)(database_1.pool, availableElectionQuery);
            res.render("admin/voter_manage", { votedUsers: paginatedUsers, totalUsers, election, user_id, availableElections, currentPage, totalPages, limit });
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
            const import_records = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM users_import_records ORDER BY import_date DESC');
            res.render("admin/control-panel-user", { programs, import_records });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL2NvbnRyb2xsZXJzL2FkbWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUV0RCxvREFBNkM7QUFFN0MsaUVBQXdLO0FBQ3hLLHlEQUFxSTtBQUNySSxpRkFBc0U7QUFDdEUsMkRBQTBFO0FBSzFFLDZEQUEwRDtBQUUxRCxTQUFzQixpQkFBaUIsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUNuRixJQUFJLENBQUM7WUFFRCxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBVyxlQUFJLEVBQUUsbUdBQW1HLENBQUMsQ0FBQztZQUV6SixNQUFNLGNBQWMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksb0JBQW9CLEdBQWMsRUFBRSxDQUFBO1lBRXhDLElBQUksY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDNUIsb0JBQW9CLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQUMsZUFBSSxFQUFFLDhEQUE4RCxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQTtZQUNwSSxDQUFDO1lBRUQsR0FBRyxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxFQUFFLFNBQVMsRUFBRSxvQkFBb0IsRUFBRSxDQUFDLENBQUE7UUFDL0UsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDZixDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBaEJELDhDQWdCQztBQUVELFNBQXNCLGtCQUFrQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQ3BGLElBQUksQ0FBQztZQUNELE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBQSxtQkFB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