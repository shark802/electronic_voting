"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const router = (0, express_1.default)();
router.post("/login", auth_1.loginFunction);
router.post("/logout", auth_1.logoutFunction);
router.post("/verified-face/status", auth_1.isFaceVerified);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvcm91dGVzL2F1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBNkI7QUFDN0IsOENBQW9GO0FBRXBGLE1BQU0sTUFBTSxHQUFHLElBQUEsaUJBQU0sR0FBRSxDQUFDO0FBRXhCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLG9CQUFhLENBQUMsQ0FBQztBQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxxQkFBYyxDQUFDLENBQUM7QUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxxQkFBYyxDQUFDLENBQUM7QUFFckQsa0JBQWUsTUFBTSxDQUFDIn0=