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
    .put(candidate_1.updateCandidateFunction);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuZGlkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9yb3V0ZXMvY2FuZGlkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWlDO0FBQ2pDLHdEQUF5RjtBQUN6RiwrREFBNEQ7QUFFNUQsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBVyxDQUFDLENBQUM7QUFFeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsZ0NBQW9CLENBQUMsQ0FBQztBQUVoRCxNQUFNO0tBQ0QsS0FBSyxDQUFDLGdCQUFnQixDQUFDO0tBQ3ZCLEdBQUcsQ0FBQyxtQ0FBdUIsQ0FBQyxDQUFBO0FBRWpDLGtCQUFlLE1BQU0sQ0FBQyJ9