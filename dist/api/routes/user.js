"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const toUpperCase_1 = require("../../middlewares/toUpperCase");
const multerConfig_1 = __importDefault(require("../../config/multerConfig"));
const router = (0, express_1.Router)();
router.use(toUpperCase_1.toUpperCase);
router.route('/user/:id')
    .get(user_1.getUserByIdNumber)
    .put(user_1.updateUserFunction);
router.post('/user-new', user_1.newUserFunction);
router.post('/import-user', multerConfig_1.default.single('userFile'), user_1.importUsers);
router.get('/import-records', user_1.getAllImportUserRecords);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvcm91dGVzL3VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxQ0FBaUM7QUFDakMsOENBQW1JO0FBQ25JLCtEQUE0RDtBQUM1RCw2RUFBK0M7QUFFL0MsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFDeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBVyxDQUFDLENBQUM7QUFFeEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7S0FDcEIsR0FBRyxDQUFDLHdCQUFpQixDQUFDO0tBQ3RCLEdBQUcsQ0FBQyx5QkFBa0IsQ0FBQyxDQUFBO0FBRTVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLHNCQUFlLENBQUMsQ0FBQztBQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxrQkFBVyxDQUFDLENBQUM7QUFDcEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSw4QkFBdUIsQ0FBQyxDQUFDO0FBRXZELGtCQUFlLE1BQU0sQ0FBQyJ9