"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const election_1 = __importDefault(require("./routes/election"));
const auth_1 = __importDefault(require("./routes/auth"));
const candidate_1 = __importDefault(require("./routes/candidate"));
const vote_1 = __importDefault(require("./routes/vote"));
const registerDevice_1 = __importDefault(require("./routes/registerDevice"));
const population_1 = __importDefault(require("./routes/population"));
const user_1 = __importDefault(require("./routes/user"));
const router = (0, express_1.Router)();
router.use(election_1.default);
router.use(auth_1.default);
router.use(candidate_1.default);
router.use(vote_1.default);
router.use(registerDevice_1.default);
router.use(population_1.default);
router.use(user_1.default);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscUNBQWlDO0FBQ2pDLGlFQUErQztBQUMvQyx5REFBdUM7QUFDdkMsbUVBQWlEO0FBQ2pELHlEQUF1QztBQUN2Qyw2RUFBMkQ7QUFDM0QscUVBQW1EO0FBQ25ELHlEQUF1QztBQUV2QyxNQUFNLE1BQU0sR0FBRyxJQUFBLGdCQUFNLEdBQUUsQ0FBQztBQUV4QixNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFjLENBQUMsQ0FBQztBQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLGNBQVUsQ0FBQyxDQUFDO0FBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQWUsQ0FBQyxDQUFDO0FBQzVCLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBVSxDQUFDLENBQUM7QUFDdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBb0IsQ0FBQyxDQUFDO0FBQ2pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQWdCLENBQUMsQ0FBQztBQUM3QixNQUFNLENBQUMsR0FBRyxDQUFDLGNBQVUsQ0FBQyxDQUFDO0FBRXZCLGtCQUFlLE1BQU0sQ0FBQyJ9