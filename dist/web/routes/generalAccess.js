"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generalAccess_1 = require("../controllers/generalAccess");
const router = (0, express_1.Router)();
router.get("/", generalAccess_1.landingPage);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhbEFjY2Vzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy93ZWIvcm91dGVzL2dlbmVyYWxBY2Nlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBaUM7QUFDakMsZ0VBQTJEO0FBRTNELE1BQU0sTUFBTSxHQUFHLElBQUEsZ0JBQU0sR0FBRSxDQUFBO0FBRXZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLDJCQUFXLENBQUMsQ0FBQTtBQUU1QixrQkFBZSxNQUFNLENBQUEifQ==