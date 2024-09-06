"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registerDevice_1 = require("../controllers/registerDevice");
const router = (0, express_1.Router)();
router.route('/uuid')
    .post(registerDevice_1.requestUuidFunction);
router.post('/uuid-validation', registerDevice_1.validateUuid);
router.route('/uuid/:id')
    .get(registerDevice_1.checkUuidStatus)
    .delete(registerDevice_1.declineRequestFunction)
    .put(registerDevice_1.updateRegisterStatusFunction);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXJEZXZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL3JvdXRlcy9yZWdpc3RlckRldmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFpQztBQUNqQyxrRUFBeUo7QUFFekosTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7S0FDaEIsSUFBSSxDQUFDLG9DQUFtQixDQUFDLENBQUE7QUFFOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSw2QkFBWSxDQUFDLENBQUE7QUFFN0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7S0FDcEIsR0FBRyxDQUFDLGdDQUFlLENBQUM7S0FDcEIsTUFBTSxDQUFDLHVDQUFzQixDQUFDO0tBQzlCLEdBQUcsQ0FBQyw2Q0FBNEIsQ0FBQyxDQUFBO0FBR3RDLGtCQUFlLE1BQU0sQ0FBQyJ9