"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_1 = require("../controllers/report");
const router = (0, express_1.Router)();
router.get('/voter/:id', report_1.previewVoterParticipationReports);
router.get('/complete/voter/:id', report_1.completeVoterParticipationReports);
router.get('/program/voter/:id', report_1.programHeadVoterParticipationReport);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy93ZWIvcm91dGVzL3JlcG9ydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBaUM7QUFDakMsa0RBQWlKO0FBRWpKLE1BQU0sTUFBTSxHQUFHLElBQUEsZ0JBQU0sR0FBRSxDQUFDO0FBRXhCLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLHlDQUFnQyxDQUFDLENBQUM7QUFDM0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSwwQ0FBaUMsQ0FBQyxDQUFDO0FBQ3JFLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsNENBQW1DLENBQUMsQ0FBQztBQUV0RSxrQkFBZSxNQUFNLENBQUMifQ==