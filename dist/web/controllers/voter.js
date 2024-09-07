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
