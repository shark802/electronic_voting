"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const election_1 = require("../controllers/election");
const router = (0, express_1.Router)();
router
    .route("/elections")
    .post(election_1.createElection);
router
    .route("/elections/:id")
    .get(election_1.findElectionByID)
    .delete(election_1.deleteElection)
    .put(election_1.updateElection)
    .patch(election_1.updateElectionStatus);
router.put('/election-overview/:id', election_1.closeElectionDashboard);
router.get('/election-population', election_1.getElectionPopulation);
router.get('/election-voted', election_1.getNumberOfVoted);
router.get('/program-population', election_1.getTotalPopulationByProgram);
router.get('/program-voted', election_1.getTotalVotedInElectionByProgram);
router.get('/election/complete/total-voted', election_1.completedElectionsTotalVoted);
router.get('/election/turn-out/year-level', election_1.yearLevelTurnoutPercentage);
router.get('/election/turn-out/department', election_1.departmentTurnoutPercentage);
router.get('/election/turn-out/vote-mode', election_1.votingModeEngagement);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL3JvdXRlcy9lbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFpQztBQUNqQyxzREFBOFc7QUFFOVcsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTTtLQUNKLEtBQUssQ0FBQyxZQUFZLENBQUM7S0FDbkIsSUFBSSxDQUFDLHlCQUFjLENBQUMsQ0FBQztBQUV2QixNQUFNO0tBQ0osS0FBSyxDQUFDLGdCQUFnQixDQUFDO0tBQ3ZCLEdBQUcsQ0FBQywyQkFBZ0IsQ0FBQztLQUNyQixNQUFNLENBQUMseUJBQWMsQ0FBQztLQUN0QixHQUFHLENBQUMseUJBQWMsQ0FBQztLQUNuQixLQUFLLENBQUMsK0JBQW9CLENBQUMsQ0FBQTtBQUU3QixNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLGlDQUFzQixDQUFDLENBQUM7QUFDN0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxnQ0FBcUIsQ0FBQyxDQUFDO0FBQzFELE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsMkJBQWdCLENBQUMsQ0FBQztBQUNoRCxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLHNDQUEyQixDQUFDLENBQUM7QUFDL0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSwyQ0FBZ0MsQ0FBQyxDQUFDO0FBQy9ELE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLEVBQUUsdUNBQTRCLENBQUMsQ0FBQztBQUMzRSxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixFQUFFLHFDQUEwQixDQUFDLENBQUM7QUFDeEUsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsRUFBRSxzQ0FBMkIsQ0FBQyxDQUFDO0FBQ3pFLE1BQU0sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUsK0JBQW9CLENBQUMsQ0FBQztBQUVqRSxrQkFBZSxNQUFNLENBQUMifQ==