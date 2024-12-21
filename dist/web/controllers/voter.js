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
const cryptoService_1 = require("../../utils/cryptoService");
function electionPage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            req.session.faceVerified = false;
            const user_id = req.session.user.user_id;
            const [register_face] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM register_faces WHERE id_number = ? AND deleted_at IS NULL LIMIT 1', [user_id]);
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
            if (!election)
                return res.redirect('/election?redirectMessage=Election Not Available');
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
            return res.render('voter/electionResultForVoter', { user, candidatesVoteTally, positionList, electionInfo });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.renderElectionResult = renderElectionResult;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL2NvbnRyb2xsZXJzL3ZvdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUV0RCxvREFBNkM7QUFFN0MscUVBQWtFO0FBQ2xFLCtEQUFvRTtBQUNwRSxtRkFBZ0Y7QUFDaEYseURBQXFJO0FBQ3JJLDJEQUEwRTtBQUMxRSxpRkFBc0U7QUFJdEUsNkRBQTBEO0FBRTFELFNBQXNCLFlBQVksQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUM5RSxJQUFJLENBQUM7WUFDRCxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFFakMsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFLLENBQUMsT0FBTyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBZ0IsZUFBSSxFQUFFLGlGQUFpRixFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUU3SixNQUFNLGVBQWUsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBRXJELE1BQU0sS0FBSyxHQUFHLHdGQUF3RixDQUFDO1lBQ3ZHLE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFXLGVBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM5RCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQU8sZUFBSSxFQUFFLHlDQUF5QyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtZQUVsRyxHQUFHLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDO1FBQzlFLENBQUM7UUFBQyxPQUFPLEtBQUss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