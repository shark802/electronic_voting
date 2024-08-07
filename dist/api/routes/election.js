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
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL3JvdXRlcy9lbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFpQztBQUNqQyxzREFBaUk7QUFFakksTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTTtLQUNKLEtBQUssQ0FBQyxZQUFZLENBQUM7S0FDbkIsSUFBSSxDQUFDLHlCQUFjLENBQUMsQ0FBQztBQUV2QixNQUFNO0tBQ0osS0FBSyxDQUFDLGdCQUFnQixDQUFDO0tBQ3ZCLEdBQUcsQ0FBQywyQkFBZ0IsQ0FBQztLQUNyQixNQUFNLENBQUMseUJBQWMsQ0FBQztLQUN0QixHQUFHLENBQUMseUJBQWMsQ0FBQztLQUNuQixLQUFLLENBQUMsK0JBQW9CLENBQUMsQ0FBQTtBQUU3QixrQkFBZSxNQUFNLENBQUMifQ==