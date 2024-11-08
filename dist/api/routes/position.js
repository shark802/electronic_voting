"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const position_1 = require("../controllers/position");
const toUpperCase_1 = require("../../middlewares/toUpperCase");
const router = (0, express_1.Router)();
router.use(toUpperCase_1.toUpperCase);
router.route("/position")
    .post(position_1.addPosition)
    .get(position_1.getAllPositions);
router.delete('/position/:id', position_1.removePosition);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL3JvdXRlcy9wb3NpdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFpQztBQUNqQyxzREFBdUY7QUFDdkYsK0RBQTREO0FBRTVELE1BQU0sTUFBTSxHQUFHLElBQUEsZ0JBQU0sR0FBRSxDQUFDO0FBRXhCLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQVcsQ0FBQyxDQUFDO0FBRXhCLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO0tBQ3BCLElBQUksQ0FBQyxzQkFBVyxDQUFDO0tBQ2pCLEdBQUcsQ0FBQywwQkFBZSxDQUFDLENBQUE7QUFFekIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUseUJBQWMsQ0FBQyxDQUFBO0FBRTlDLGtCQUFlLE1BQU0sQ0FBQyJ9