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
exports.renderElectionResult = exports.renderElectionBallot = exports.electionPage = void 0;
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
const isValidTimeToVote_1 = require("../../utils/isValidTimeToVote");
const voteService_1 = require("../../data_access/voteService");
const hasUserRegisterFaceImage_1 = require("../../utils/hasUserRegisterFaceImage");
const election_1 = require("../../data_access/election");
const customErrors_1 = require("../../utils/customErrors");
const checkElectionTimeStatus_1 = require("../../utils/checkElectionTimeStatus");
function electionPage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            req.session.faceVerified = false;
            const user_id = req.session.user.user_id;
            const [register_face] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM register_faces WHERE id_number = ? LIMIT 1', [user_id]);
            const face_registered = register_face ? true : false;
            const query = "SELECT * FROM elections WHERE deleted_at IS NULL AND is_active = 1 ORDER BY date_start";
            const electionList = yield (0, query_1.selectQuery)(database_1.pool, query);
            const [user] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM users WHERE id_number = ?', [user_id]);
            res.render("voter/electionPage", { electionList, user, face_registered });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.electionPage = electionPage;
function renderElectionBallot(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const id_number = req.session.user.user_id;
            const election_id = req.params.electionId;
            const deviceRegistrationStatus = (_a = req.session) === null || _a === void 0 ? void 0 : _a.deviceRegistrationStatus;
            const faceVerified = (_b = req.session) === null || _b === void 0 ? void 0 : _b.faceVerified;
            // Check if the user has already voted
            const hasVoted = yield (0, voteService_1.checkIfUserHasVoted)(id_number, election_id);
            if (hasVoted)
                return res.redirect('/election?redirectMessage=You have already voted');
            // If the device is not registered, check if user is available for face authentication.
            if ((!deviceRegistrationStatus || deviceRegistrationStatus !== "REGISTERED") && !faceVerified) {
                const isUserRegisteredFaceImage = yield (0, hasUserRegisterFaceImage_1.hasUserRegisterFaceImage)(id_number);
                if (!isUserRegisteredFaceImage)
                    return res.redirect("/election?redirectMessage=Please register your face for authentication to continue.");
                // redirect user to face authentication
                return res.redirect(`/authenticate-face?election=${election_id}`);
            }
            const sqlQuery = `
        SELECT u.id_number, u.firstname, u.lastname , u.course, c.position, c.candidate_profile, c.party
        FROM users u JOIN candidates c
        ON u.id_number = c.id_number
        WHERE c.election_id = ?
        AND c.enabled = 1
        AND c.deleted IS NULL
        `;
            const [[user], [election], candidateList] = yield Promise.all([
                (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM users WHERE id_number = ?", [id_number]),
                (0, query_1.selectQuery)(database_1.pool, "SELECT * FROM elections WHERE election_id = ? AND deleted_at IS NULL", [election_id]),
                (0, query_1.selectQuery)(database_1.pool, sqlQuery, [election_id])
            ]);
            const candidatePositionList = (yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM positions WHERE deleted_at IS NULL')).map(position => position.position);
            const departmentsMaximumSenatorVote = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE deleted_at IS NULL');
            const departmentMaxSenatorVote = departmentsMaximumSenatorVote.reduce((acc, department) => {
                acc[department.department_code] = department.max_select_senator;
                return acc;
            }, {});
            if (!(0, isValidTimeToVote_1.isValidTimeToVote)(election))
                return res.redirect("/election?redirectMessage=Voting is currently closed");
            return res.render('voter/voteBallot', { user, candidatePositionList, candidateList, election, departmentMaxSenatorVote });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.renderElectionBallot = renderElectionBallot;
function renderElectionResult(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.session.user.user_id;
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
            const positionList = (yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM positions WHERE deleted_at IS NULL')).map(position => position.position);
            const [user] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM users WHERE id_number = ? LIMIT 1', [userId]);
            const candidatesVoteTally = yield (0, election_1.getCandidatesTotalTally)(electionId);
            return res.render('voter/electionResultForVoter', { user, candidatesVoteTally, positionList, electionInfo });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.renderElectionResult = renderElectionResult;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL2NvbnRyb2xsZXJzL3ZvdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUV0RCxvREFBNkM7QUFFN0MscUVBQWtFO0FBQ2xFLCtEQUFvRTtBQUNwRSxtRkFBZ0Y7QUFDaEYseURBQTBGO0FBQzFGLDJEQUEwRTtBQUMxRSxpRkFBc0U7QUFLdEUsU0FBc0IsWUFBWSxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQzlFLElBQUksQ0FBQztZQUNELEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUVqQyxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUssQ0FBQyxPQUFPLENBQUM7WUFDMUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFnQixlQUFJLEVBQUUsMERBQTBELEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBRXRJLE1BQU0sZUFBZSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFFckQsTUFBTSxLQUFLLEdBQUcsd0ZBQXdGLENBQUM7WUFDdkcsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQVcsZUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBTyxlQUFJLEVBQUUseUNBQXlDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1lBRWxHLEdBQUcsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDOUUsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFD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