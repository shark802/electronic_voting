"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generalAccess_1 = __importDefault(require("./routes/generalAccess"));
const admin_1 = __importDefault(require("./routes/admin"));
const router = (0, express_1.Router)();
router.use(generalAccess_1.default);
router.use("/admin", admin_1.default);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvd2ViL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscUNBQThCO0FBQzlCLDJFQUFrRDtBQUNsRCwyREFBd0M7QUFFeEMsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUE7QUFFdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBYSxDQUFDLENBQUE7QUFDekIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsZUFBVyxDQUFDLENBQUE7QUFFakMsa0JBQWUsTUFBTSxDQUFBIn0=