"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vote_1 = require("../controllers/vote");
const router = (0, express_1.Router)();
router
    .route('/vote')
    .post(vote_1.saveVoteFunction);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvcm91dGVzL3ZvdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBaUM7QUFDakMsOENBQXVEO0FBRXZELE1BQU0sTUFBTSxHQUFHLElBQUEsZ0JBQU0sR0FBRSxDQUFDO0FBRXhCLE1BQU07S0FDRCxLQUFLLENBQUMsT0FBTyxDQUFDO0tBQ2QsSUFBSSxDQUFDLHVCQUFnQixDQUFDLENBQUE7QUFHM0Isa0JBQWUsTUFBTSxDQUFDIn0=