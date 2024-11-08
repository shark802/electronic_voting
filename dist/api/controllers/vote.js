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
function saveVoteFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { electionId } = req.body;
            const selectedCandidate = req.body.selectedCandidate;
            const user_id = req.session.user.user_id;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvdm90ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwwRkFBeUU7QUFFekUsMkRBQTBFO0FBQzFFLCtEQUFrSTtBQUNsSSxvREFBNkM7QUFJN0MsU0FBc0IsZ0JBQWdCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7UUFDbEYsSUFBSSxDQUFDO1lBQ0QsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDaEMsTUFBTSxpQkFBaUIsR0FBZ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQTtZQUNqRyxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUssQ0FBQyxPQUFPLENBQUM7WUFFMUMsTUFBTSxNQUFNLEdBQVcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFFckMsSUFBSSxDQUFDLFVBQVU7Z0JBQUUsTUFBTSxJQUFJLDhCQUFlLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUNyRSxJQUFJLENBQUMsaUJBQWlCLElBQUksT0FBTyxpQkFBaUIsS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDO2dCQUFFLE1BQU0sSUFBSSw4QkFBZSxDQUFDLCtDQUErQyxDQUFDLENBQUM7WUFFM0wsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLGlDQUFtQixFQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNoRSxJQUFJLFFBQVE7Z0JBQUUsTUFBTSxJQUFJLDRCQUFhLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUVqRSx1RUFBdUU7WUFDdkUsTUFBTSxVQUFVLEdBQUcsTUFBTSxlQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDOUMsSUFBSSxDQUFDO2dCQUNELE1BQU0sVUFBVSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3BDLE1BQU0sSUFBQSxzQkFBUSxFQUFDLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ25FLE1BQU0sSUFBQSx5Q0FBMkIsRUFBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQzdFLE1BQU0sSUFBQSxtQ0FBcUIsRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUM3RCxNQUFNLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFFMUIsaUdBQWlHO2dCQUNqRyx5Q0FBWSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUVuRCw2RUFBNkU7Z0JBQzdFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUNwQixXQUFXLEVBQUUsVUFBVTtvQkFDdkIsUUFBUSxFQUFFLE9BQU87b0JBQ2pCLG9CQUFvQixFQUFFLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTt3QkFDcEQsT0FBTzs0QkFDSCxZQUFZLEVBQUUsU0FBUyxDQUFDLFNBQVM7NEJBQ2pDLGtCQUFrQixFQUFFLFNBQVMsQ0FBQyxRQUFRO3lCQUN6QyxDQUFBO29CQUNMLENBQUMsQ0FBQztpQkFDTCxDQUFDLENBQUM7Z0JBRUgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztZQUNyRCxDQUFDO1lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztnQkFDYixNQUFNLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWhCLENBQUM7b0JBQVMsQ0FBQztnQkFDUCxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDekIsQ0FBQztRQUVMLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hCLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFsREQsNENBa0RDIn0=