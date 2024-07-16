"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidate_1 = require("../controllers/candidate");
const router = (0, express_1.Router)();
router.post("/candidate", candidate_1.addCandidateFunction);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuZGlkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9yb3V0ZXMvY2FuZGlkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWlDO0FBQ2pDLHdEQUFnRTtBQUVoRSxNQUFNLE1BQU0sR0FBRyxJQUFBLGdCQUFNLEdBQUUsQ0FBQztBQUV4QixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxnQ0FBb0IsQ0FBQyxDQUFDO0FBRWhELGtCQUFlLE1BQU0sQ0FBQyJ9