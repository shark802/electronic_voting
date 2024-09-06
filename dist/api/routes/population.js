"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const population_1 = require("../controllers/population");
const router = (0, express_1.Router)();
router.put('/population/:id', population_1.updateVoterPopulationFunction);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdWxhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvcm91dGVzL3BvcHVsYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBaUM7QUFDakMsMERBQTBFO0FBRTFFLE1BQU0sTUFBTSxHQUFHLElBQUEsZ0JBQU0sR0FBRSxDQUFDO0FBRXhCLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsMENBQTZCLENBQUMsQ0FBQztBQUU3RCxrQkFBZSxNQUFNLENBQUMifQ==