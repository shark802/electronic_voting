"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ipAddress_1 = require("../controllers/ipAddress");
const toUpperCase_1 = require("../../middlewares/toUpperCase");
const router = (0, express_1.Router)();
router.use(toUpperCase_1.toUpperCase);
router.route('/ip-address')
    .post(ipAddress_1.addIpAddress)
    .get(ipAddress_1.getIpAddress)
    .put(ipAddress_1.removeIpAddress);
router.route('/ip-address/all')
    .get(ipAddress_1.getAllIpAddress);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXBBZGRyZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9yb3V0ZXMvaXBBZGRyZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWlDO0FBQ2pDLHdEQUF3RztBQUN4RywrREFBNEQ7QUFFNUQsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFDeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBVyxDQUFDLENBQUE7QUFFdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7S0FDdEIsSUFBSSxDQUFDLHdCQUFZLENBQUM7S0FDbEIsR0FBRyxDQUFDLHdCQUFZLENBQUM7S0FDakIsR0FBRyxDQUFDLDJCQUFlLENBQUMsQ0FBQztBQUUxQixNQUFNLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDO0tBQzFCLEdBQUcsQ0FBQywyQkFBZSxDQUFDLENBQUM7QUFFMUIsa0JBQWUsTUFBTSxDQUFDIn0=