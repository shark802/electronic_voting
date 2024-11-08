"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reports_1 = require("../controllers/reports");
const router = (0, express_1.default)();
router.get('/pdf-report/voter/:id', reports_1.generateVoterReportInPdf);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvcm91dGVzL3JlcG9ydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBNkI7QUFDN0Isb0RBQWtFO0FBRWxFLE1BQU0sTUFBTSxHQUFHLElBQUEsaUJBQU0sR0FBRSxDQUFDO0FBRXhCLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsa0NBQXdCLENBQUMsQ0FBQztBQUU5RCxrQkFBZSxNQUFNLENBQUEifQ==