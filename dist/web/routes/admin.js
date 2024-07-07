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
router.get("/election/:id/edit", admin_1.editElection);
router.get("/election/history", admin_1.viewElectionHistory);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL3JvdXRlcy9hZG1pbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUE4QjtBQUM5QixnREFhOEI7QUFFOUIsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsWUFBWTtBQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUseUJBQWlCLENBQUMsQ0FBQztBQUNyRCxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLDBCQUFrQixDQUFDLENBQUM7QUFFeEQsWUFBWTtBQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsb0JBQVksQ0FBQyxDQUFDO0FBQzNDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLG1CQUFXLENBQUMsQ0FBQztBQUN6QyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLG9CQUFZLENBQUMsQ0FBQztBQUMvQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLDJCQUFtQixDQUFDLENBQUE7QUFFcEQsWUFBWTtBQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsdUJBQWUsQ0FBQyxDQUFDO0FBQ2pELE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsb0JBQVksQ0FBQyxDQUFDO0FBRTNDLFFBQVE7QUFDUixNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxtQkFBVyxDQUFDLENBQUM7QUFFekMsaUJBQWlCO0FBQ2pCLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsNEJBQW9CLENBQUMsQ0FBQztBQUM3RCxNQUFNLENBQUMsR0FBRyxDQUFDLDZCQUE2QixFQUFFLDBCQUFrQixDQUFDLENBQUM7QUFFOUQsZ0JBQWdCO0FBQ2hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEVBQUUsaUJBQVMsQ0FBQyxDQUFDO0FBRXBELGtCQUFlLE1BQU0sQ0FBQSJ9