"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const election_1 = require("../controllers/election");
const router = (0, express_1.Router)();
router
    .route("/elections")
    .get(election_1.findElectionByID)
    .post(election_1.createElection);
router
    .route("/elections/:id")
    .delete(election_1.deleteElection)
    .put(election_1.updateElection);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL3JvdXRlcy9lbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFpQztBQUNqQyxzREFBMkc7QUFFM0csTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTTtLQUNKLEtBQUssQ0FBQyxZQUFZLENBQUM7S0FDbkIsR0FBRyxDQUFDLDJCQUFnQixDQUFDO0tBQ3JCLElBQUksQ0FBQyx5QkFBYyxDQUFDLENBQUM7QUFFdkIsTUFBTTtLQUNKLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztLQUN2QixNQUFNLENBQUMseUJBQWMsQ0FBQztLQUN0QixHQUFHLENBQUMseUJBQWMsQ0FBQyxDQUFDO0FBRXRCLGtCQUFlLE1BQU0sQ0FBQyJ9