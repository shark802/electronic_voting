"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const programHead_1 = require("../controllers/programHead");
const router = (0, express_1.Router)();
router.get('/dashboard/overview', programHead_1.programHeadDashboardOverviewPage);
router.get('/dashboard/vote-tally', programHead_1.programHeadDashboardVoteTallyPage);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3JhbUhlYWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL3JvdXRlcy9wcm9ncmFtSGVhZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFnQztBQUNoQyw0REFBaUg7QUFFakgsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSw4Q0FBZ0MsQ0FBQyxDQUFBO0FBQ25FLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsK0NBQWlDLENBQUMsQ0FBQTtBQUV0RSxrQkFBZSxNQUFNLENBQUMifQ==