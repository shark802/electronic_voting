"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voter_1 = require("../controllers/voter");
const authorization_1 = require("../../middlewares/authorization");
const router = (0, express_1.Router)();
router.use(authorization_1.isAuthenticated);
router.get('/election', voter_1.electionPage);
router.use(authorization_1.isValidVoter);
router.get('/ballot/:electionId', voter_1.renderElectionBallot);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL3JvdXRlcy92b3Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFpQztBQUNqQyxnREFBMEU7QUFDMUUsbUVBQWdGO0FBRWhGLE1BQU0sTUFBTSxHQUFHLElBQUEsZ0JBQU0sR0FBRSxDQUFDO0FBRXhCLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQWUsQ0FBQyxDQUFDO0FBRTVCLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLG9CQUFZLENBQUMsQ0FBQztBQUV0QyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUFZLENBQUMsQ0FBQTtBQUV4QixNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLDRCQUFvQixDQUFDLENBQUE7QUFHdkQsa0JBQWUsTUFBTSxDQUFDIn0=