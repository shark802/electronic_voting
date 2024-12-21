"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const department_1 = require("../controllers/department");
const router = (0, express_1.Router)();
router.route('/department')
    .post(department_1.addDepartment)
    .get(department_1.getDepartmentObject);
router.put('/department/senator-max-vote', department_1.setDepartmentMaxSenatorVote);
router.put('/department/:id', department_1.removeDepartment);
router.post('/program', department_1.addProgram);
router.get('/programs', department_1.getAllPrograms);
router.delete('/program/:id', department_1.removeProgram);
router.get('/departments', department_1.getAllDepartments);
router.get('/program', department_1.getDepartmentPrograms);
router.get('/section', department_1.getProgramSection);
router.get('/year-level', department_1.getAllYearLevel);
router.get('/department/turnout', department_1.getAllYearLevel);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwYXJ0bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvcm91dGVzL2RlcGFydG1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBaUM7QUFDakMsMERBQXVQO0FBRXZQLE1BQU0sTUFBTSxHQUFHLElBQUEsZ0JBQU0sR0FBRSxDQUFDO0FBRXhCLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDO0tBQ3RCLElBQUksQ0FBQywwQkFBYSxDQUFDO0tBQ25CLEdBQUcsQ0FBQyxnQ0FBbUIsQ0FBQyxDQUFBO0FBRzdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUsd0NBQTJCLENBQUMsQ0FBQztBQUN4RSxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLDZCQUFnQixDQUFDLENBQUM7QUFFaEQsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsdUJBQVUsQ0FBQyxDQUFBO0FBQ25DLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLDJCQUFjLENBQUMsQ0FBQTtBQUN2QyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSwwQkFBYSxDQUFDLENBQUE7QUFFNUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsOEJBQWlCLENBQUMsQ0FBQTtBQUM3QyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxrQ0FBcUIsQ0FBQyxDQUFBO0FBQzdDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLDhCQUFpQixDQUFDLENBQUE7QUFDekMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsNEJBQWUsQ0FBQyxDQUFBO0FBQzFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsNEJBQWUsQ0FBQyxDQUFBO0FBRWxELGtCQUFlLE1BQU0sQ0FBQyJ9