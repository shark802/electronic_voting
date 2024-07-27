"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidate_1 = require("../controllers/candidate");
const toUpperCase_1 = require("../../middlewares/toUpperCase");
const router = (0, express_1.Router)();
router.use(toUpperCase_1.toUpperCase);
router.post("/candidate", candidate_1.addCandidateFunction);
router
    .route("/candidate/:id")
    .put(candidate_1.updateCandidateFunction)
    .delete(candidate_1.deleteCandidateFunction);
router.get("/candidate", candidate_1.getManageCandidates);
router.put("/cadidate/:id/status", candidate_1.updateCandidateStatus);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuZGlkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9yb3V0ZXMvY2FuZGlkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWlDO0FBQ2pDLHdEQUE4SjtBQUM5SiwrREFBNEQ7QUFFNUQsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBVyxDQUFDLENBQUM7QUFFeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsZ0NBQW9CLENBQUMsQ0FBQztBQUVoRCxNQUFNO0tBQ0QsS0FBSyxDQUFDLGdCQUFnQixDQUFDO0tBQ3ZCLEdBQUcsQ0FBQyxtQ0FBdUIsQ0FBQztLQUM1QixNQUFNLENBQUMsbUNBQXVCLENBQUMsQ0FBQTtBQUVwQyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSwrQkFBbUIsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsaUNBQXFCLENBQUMsQ0FBQztBQUMxRCxrQkFBZSxNQUFNLENBQUMifQ==