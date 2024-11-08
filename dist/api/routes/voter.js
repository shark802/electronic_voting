"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const voter_1 = require("../controllers/voter");
const router = (0, express_1.default)();
router.get('/voter/voter-history/:id', voter_1.getAllVoterElectionHistory);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL3JvdXRlcy92b3Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUE2QjtBQUM3QixnREFBa0U7QUFFbEUsTUFBTSxNQUFNLEdBQUcsSUFBQSxpQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxrQ0FBMEIsQ0FBQyxDQUFBO0FBRWxFLGtCQUFlLE1BQU0sQ0FBQyJ9