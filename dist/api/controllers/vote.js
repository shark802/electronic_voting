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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveVoteFunction = void 0;
const globalEventEmitterInstance_1 = require("./../../events/globalEventEmitterInstance");
const customErrors_1 = require("../../utils/customErrors");
const voteService_1 = require("../../data_access/voteService");
const database_1 = require("../../config/database");
const query_1 = require("../../data_access/query");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function saveVoteFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { electionId } = req.body;
            const selectedCandidate = req.body.selectedCandidate;
            const user_id = req.session.user.user_id;
            const faceVerified = (_a = req.session) === null || _a === void 0 ? void 0 : _a.faceVerified; // available if voter vote online and authenticated their face
            const socket = res.locals.io;
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
                yield (0, voteService_1.updateVoterVoteStatus)(connection, user_id, electionId, faceVerified);
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
                const ENVIRONMENT = process.env.NODE_ENV;
                const FACE_SERVICE_DOMAIN = ENVIRONMENT === 'production' ? `https://${process.env.FACE_RECOGNITION_SERVICE_DOMAIN}` : 'http://localhost:8000';
                const [registerFaceFilename] = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM register_faces WHERE id_number = ? AND deleted_at IS NULL LIMIT 1', [user_id]);
                if (registerFaceFilename) {
                    yield Promise.all([
                        fetch(`${FACE_SERVICE_DOMAIN}/api/delete/${registerFaceFilename.saved_face_filename}`, { method: 'DELETE' }),
                        (0, query_1.updateQuery)(database_1.pool, 'UPDATE register_faces SET deleted_at = CURRENT_TIMESTAMP() WHERE id = ?', [registerFaceFilename.id])
                    ]);
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvdm90ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwRkFBeUU7QUFFekUsMkRBQTBFO0FBQzFFLCtEQUFrSTtBQUNsSSxvREFBNkM7QUFHN0MsbURBQW1FO0FBRW5FLG9EQUE0QjtBQUM1QixnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWhCLFNBQXNCLGdCQUFnQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7OztRQUNsRixJQUFJLENBQUM7WUFDRCxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNoQyxNQUFNLGlCQUFpQixHQUFnRCxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFBO1lBQ2pHLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSyxDQUFDLE9BQU8sQ0FBQztZQUMxQyxNQUFNLFlBQVksR0FBRyxNQUFBLEdBQUcsQ0FBQyxPQUFPLDBDQUFFLFlBQVksQ0FBQyxDQUFDLDhEQUE4RDtZQUU5RyxNQUFNLE1BQU0sR0FBVyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUVyQyxJQUFJLENBQUMsVUFBVTtnQkFBRSxNQUFNLElBQUksOEJBQWUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxPQUFPLGlCQUFpQixLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsTUFBTSxLQUFLLENBQUM7Z0JBQUUsTUFBTSxJQUFJLDhCQUFlLENBQUMsK0NBQStDLENBQUMsQ0FBQztZQUUzTCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsaUNBQW1CLEVBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ2hFLElBQUksUUFBUTtn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