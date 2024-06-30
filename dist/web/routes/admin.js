"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../controllers/admin");
const router = (0, express_1.Router)();
// Dashboard
router.get("/dashboard/overview", admin_1.dashboardOverview);
router.get("/dashboard/vote-tally", admin_1.dashboardVoteTally);
// Elections
router.get("/election/view", admin_1.viewElection);
router.get("/election/new", admin_1.newElection);
// Candidate
router.get("/candidate/manage", admin_1.manageCandidate);
router.get("/candidate/new", admin_1.addCandidate);
// Voter
router.get("/voter/manage", admin_1.manageVoter);
//Register Device
router.get("/register-device/request", admin_1.reviewRegisterDevice);
router.get("/register-device/registered", admin_1.viewRegisterDevice);
// Control Panel
router.get("/control-panel/import-user", admin_1.fetchUser);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL3JvdXRlcy9hZG1pbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUE4QjtBQUM5QixnREFXOEI7QUFFOUIsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUE7QUFFdkIsWUFBWTtBQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUseUJBQWlCLENBQUMsQ0FBQTtBQUNwRCxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLDBCQUFrQixDQUFDLENBQUE7QUFFdkQsWUFBWTtBQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsb0JBQVksQ0FBQyxDQUFBO0FBQzFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLG1CQUFXLENBQUMsQ0FBQTtBQUV4QyxZQUFZO0FBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSx1QkFBZSxDQUFDLENBQUE7QUFDaEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBWSxDQUFDLENBQUE7QUFFMUMsUUFBUTtBQUNSLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLG1CQUFXLENBQUMsQ0FBQTtBQUV4QyxpQkFBaUI7QUFDakIsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSw0QkFBb0IsQ0FBQyxDQUFDO0FBQzdELE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsMEJBQWtCLENBQUMsQ0FBQztBQUU5RCxnQkFBZ0I7QUFDaEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsRUFBRSxpQkFBUyxDQUFDLENBQUE7QUFFbkQsa0JBQWUsTUFBTSxDQUFBIn0=