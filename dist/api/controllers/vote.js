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
exports.saveVoteFunction = void 0;
const globalEventEmitterInstance_1 = require("./../../events/globalEventEmitterInstance");
const customErrors_1 = require("../../utils/customErrors");
const voteService_1 = require("../../data_access/voteService");
const database_1 = require("../../config/database");
// type Course = (typeof DEPARTMENT[keyof typeof DEPARTMENT])[number]
function saveVoteFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { electionId } = req.body;
            const selectedCandidate = req.body.selectedCandidate;
            const user_id = req.session.user.user_id;
            // const [user] = await selectQuery<User>(pool, 'SELECT * FROM users WHERE id_number = ?', [user_id]);
            // const voterDepartment = Object.entries(DEPARTMENT).find(([key, value]) =>
            //     value.includes(user.course as Course)
            // )?.[0]; // Get the key directly if found
            const socket = res.locals.socket;
            if (!electionId)
                throw new customErrors_1.BadRequestError('Election ID is missing');
            if (!selectedCandidate || typeof selectedCandidate !== 'object' || Object.keys(selectedCandidate).length === 0)
                throw new customErrors_1.BadRequestError('Selected candidate data is missing or invalid');
            const hasVoted = yield (0, voteService_1.checkIfUserHasVoted)(user_id, electionId);
            if (hasVoted)
                throw new customErrors_1.ConflictError("You have already voted!");
            // Start transaction for saving vote and updating candidate vote count.
            const connection = yield database_1.pool.getConnection();
            try {
                yield connection.beginTransaction();
                yield (0, voteService_1.saveVote)(connection, selectedCandidate, user_id, electionId);
                yield (0, voteService_1.incrementCandidateVoteCount)(connection, selectedCandidate, electionId);
                yield (0, voteService_1.updateVoterVoteStatus)(connection, user_id, electionId);
                yield connection.commit();
                // this event emitter emit a new-vote event that will trigger to send email with the user_id pass
                globalEventEmitterInstance_1.eventEmitter.emit('new-vote', user_id, electionId);
                //broadcast an event when new vote saved for to update the dashboard realtime
                socket.emit('new-vote', {
                    election_id: electionId,
                    voter_id: user_id,
                    voted_candidate_list: selectedCandidate.map(candidate => {
                        return {
                            candidate_id: candidate.id_number,
                            candidate_position: candidate.position
                        };
                    })
                });
                res.status(200).json({ message: "Vote saved!" });
            }
            catch (error) {
                yield connection.rollback();
                next(error);
            }
            finally {
                connection.release();
            }
        }
        catch (error) {
            next(error);
        }
    });
}
exports.saveVoteFunction = saveVoteFunction;
