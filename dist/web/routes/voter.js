"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voter_1 = require("../controllers/voter");
const router = (0, express_1.Router)();
// router.use(isAuthenticated);
router.get('/election', voter_1.electionPage);
// router.use(isValidVoter)
router.get('/ballot/:electionId', voter_1.renderElectionBallot);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL3JvdXRlcy92b3Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFpQztBQUNqQyxnREFBMEU7QUFHMUUsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsK0JBQStCO0FBRS9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLG9CQUFZLENBQUMsQ0FBQztBQUV0QywyQkFBMkI7QUFFM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSw0QkFBb0IsQ0FBQyxDQUFBO0FBR3ZELGtCQUFlLE1BQU0sQ0FBQyJ9