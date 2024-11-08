"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../controllers/admin");
const router = (0, express_1.Router)();
// Dashboard
router.get("/dashboard/overview", admin_1.dashboardOverview);
router.get("/dashboard/vote-tally", admin_1.dashboardVoteTally);
router.get("/dashboard/analytics", admin_1.electionAnalytics);
// Elections
router.get("/election/view", admin_1.viewElection);
router.get("/election/new", admin_1.newElection);
router.get("/election/:id/edit", admin_1.editElection);
router.get("/election/history", admin_1.viewElectionHistory);
router.get("/election/result/:id", admin_1.renderAdminElectionResult);
router.get("/election/complete/:id", admin_1.commpleteElectionResult);
// Candidate
router.get("/candidate/manage", admin_1.manageCandidate);
router.get("/candidate/new", admin_1.addCandidate);
// Voter
router.get("/voter/manage", admin_1.manageVoter);
// Department
router.get("/department/manage", admin_1.manageDepartment);
router.get("/department/programs", admin_1.departmentPrograms);
//Register Device
router.get("/register-device/request", admin_1.reviewRegisterDevice);
router.get("/register-device/registered", admin_1.viewRegisterDevice);
// Control Panel
router.get("/control-panel/user", admin_1.fetchUser);
router.get("/control-panel/general-settings", admin_1.generalSettings);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL3JvdXRlcy9hZG1pbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFnQztBQUNoQyxnREFtQjhCO0FBRTlCLE1BQU0sTUFBTSxHQUFHLElBQUEsZ0JBQU0sR0FBRSxDQUFDO0FBRXhCLFlBQVk7QUFDWixNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLHlCQUFpQixDQUFDLENBQUM7QUFDckQsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSwwQkFBa0IsQ0FBQyxDQUFDO0FBQ3hELE1BQU0sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUseUJBQWlCLENBQUMsQ0FBQztBQUV0RCxZQUFZO0FBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBWSxDQUFDLENBQUM7QUFDM0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsbUJBQVcsQ0FBQyxDQUFDO0FBQ3pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsb0JBQVksQ0FBQyxDQUFDO0FBQy9DLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsMkJBQW1CLENBQUMsQ0FBQztBQUNyRCxNQUFNLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLGlDQUF5QixDQUFDLENBQUM7QUFDOUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSwrQkFBdUIsQ0FBQyxDQUFBO0FBRTdELFlBQVk7QUFDWixNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLHVCQUFlLENBQUMsQ0FBQztBQUNqRCxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLG9CQUFZLENBQUMsQ0FBQztBQUUzQyxRQUFRO0FBQ1IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsbUJBQVcsQ0FBQyxDQUFDO0FBRXpDLGFBQWE7QUFDYixNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLHdCQUFnQixDQUFDLENBQUM7QUFDbkQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSwwQkFBa0IsQ0FBQyxDQUFDO0FBRXZELGlCQUFpQjtBQUNqQixNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLDRCQUFvQixDQUFDLENBQUM7QUFDN0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSwwQkFBa0IsQ0FBQyxDQUFDO0FBRTlELGdCQUFnQjtBQUNoQixNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLGlCQUFTLENBQUMsQ0FBQztBQUM3QyxNQUFNLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxFQUFFLHVCQUFlLENBQUMsQ0FBQztBQUMvRCxrQkFBZSxNQUFNLENBQUEifQ==