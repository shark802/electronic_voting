"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const election_1 = __importDefault(require("./routes/election"));
const auth_1 = __importDefault(require("./routes/auth"));
const router = (0, express_1.Router)();
router.use(election_1.default);
router.use(auth_1.default);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscUNBQWlDO0FBQ2pDLGlFQUErQztBQUMvQyx5REFBdUM7QUFFdkMsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBYyxDQUFDLENBQUM7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFVLENBQUMsQ0FBQztBQUV2QixrQkFBZSxNQUFNLENBQUMifQ==