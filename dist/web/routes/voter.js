"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voter_1 = require("../controllers/voter");
const router = (0, express_1.Router)();
router.get('/election', voter_1.electionPage);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL3JvdXRlcy92b3Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFpQztBQUNqQyxnREFBb0Q7QUFFcEQsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsb0JBQVksQ0FBQyxDQUFDO0FBRXRDLGtCQUFlLE1BQU0sQ0FBQyJ9