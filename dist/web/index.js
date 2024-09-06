"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generalAccess_1 = __importDefault(require("./routes/generalAccess"));
const admin_1 = __importDefault(require("./routes/admin"));
const voter_1 = __importDefault(require("./routes/voter"));
const programHead_1 = __importDefault(require("./routes/programHead"));
const router = (0, express_1.Router)();
router.use(generalAccess_1.default);
router.use("/admin", admin_1.default);
router.use('/program-head', programHead_1.default);
router.use(voter_1.default);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvd2ViL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscUNBQWlDO0FBQ2pDLDJFQUFtRDtBQUNuRCwyREFBeUM7QUFDekMsMkRBQXlDO0FBQ3pDLHVFQUFxRDtBQUVyRCxNQUFNLE1BQU0sR0FBRyxJQUFBLGdCQUFNLEdBQUUsQ0FBQztBQUV4QixNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUFhLENBQUMsQ0FBQTtBQUN6QixNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxlQUFXLENBQUMsQ0FBQztBQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxxQkFBaUIsQ0FBQyxDQUFDO0FBQy9DLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBVyxDQUFDLENBQUM7QUFFeEIsa0JBQWUsTUFBTSxDQUFDIn0=