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
const position_1 = require("../../utils/enums/position");
const isValidTimeToVote_1 = require("../../utils/isValidTimeToVote");
const voteService_1 = require("../../data_access/voteService");
const hasUserRegisterFaceImage_1 = require("../../utils/hasUserRegisterFaceImage");
const election_1 = require("../../data_access/election");
const customErrors_1 = require("../../utils/customErrors");
const isElectionEnded_1 = require("../../utils/isElectionEnded");
function electionPage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user_id = req.session.user.user_id;
            const query = "SELECT * FROM elections WHERE deleted_at IS NULL AND is_active = 1 ORDER BY date_start";
            const electionList = yield (0, query_1.selectQuery)(database_1.pool, query);
            const [user] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM users WHERE id_number = ?', [user_id]);
            res.render("voter/electionPage", { electionList, user });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.electionPage = electionPage;
function renderElectionBallot(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id_number = req.session.user.user_id;
            const election_id = req.params.electionId;
            const deviceRegistrationStatus = req.session.deviceRegistrationStatus;
            // Check if the user has already voted
            const hasVoted = yield (0, voteService_1.checkIfUserHasVoted)(id_number, election_id);
            if (hasVoted)
                return res.redirect('/election?redirectMessage=You have already voted');
            // If the device is not registered, check if user is available for face authentication.
            if (deviceRegistrationStatus === undefined || deviceRegistrationStatus !== "REGISTERED") {
                const isUserRegisteredFaceImage = yield (0, hasUserRegisterFaceImage_1.hasUserRegisterFaceImage)(id_number);
                if (!isUserRegisteredFaceImage)
                    return res.redirect("/election?redirectMessage=Please register your face for authentication to continue.");
                // redirect user to face authentication
            }
            const sqlQuery = `
        SELECT u.id_number, u.firstname, u.lastname , u.course, c.alias, c.position, c.candidate_profile, c.party
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
            const candidatePositionList = Object.values(position_1.Position);
            if (!(0, isValidTimeToVote_1.isValidTimeToVote)(election))
                return res.redirect("/election?redirectMessage=Voting is currently closed");
            return res.render('voter/voteBallot', { user, candidatePositionList, candidateList, election });
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
            if (!(0, isElectionEnded_1.isElectionEnded)(electionInfo))
                return res.redirect('/election?redirectMessage=Result Not Available Yet');
            const positionList = Object.values(position_1.Position);
            const [user] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM users WHERE id_number = ? LIMIT 1', [userId]);
            const candidatesVoteTally = yield (0, election_1.getCandidatesTotalTally)(electionId);
            const allCandidatesInElection = yield (0, election_1.getAllCandidatesInElection)(electionId);
            return res.render('voter/electionResultForVoter', { user, candidatesVoteTally, positionList, allCandidatesInElection });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.renderElectionResult = renderElectionResult;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL2NvbnRyb2xsZXJzL3ZvdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUV0RCxvREFBNkM7QUFDN0MseURBQXNEO0FBRXRELHFFQUFrRTtBQUNsRSwrREFBb0U7QUFDcEUsbUZBQWdGO0FBQ2hGLHlEQUFzSDtBQUN0SCwyREFBMEU7QUFDMUUsaUVBQThEO0FBRTlELFNBQXNCLFlBQVksQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUM5RSxJQUFJLENBQUM7WUFDRCxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUssQ0FBQyxPQUFPLENBQUM7WUFFMUMsTUFBTSxLQUFLLEdBQUcsd0ZBQXdGLENBQUM7WUFDdkcsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQVcsZUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBTyxlQUFJLEVBQUUseUNBQXlDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1lBRWxHLEdBQUcsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNmLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFaRCxvQ0FZQztBQUVELFNBQXNCLG9CQUFvQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQ3RGLElBQUksQ0FBQztZQUNELE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSyxDQUFDLE9BQU8sQ0FBQztZQUM1QyxNQUFNLFdBQVcsR0FBRyxHQUFH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