"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faceRecognition_1 = require("../controllers/faceRecognition");
const authorization_1 = require("../../middlewares/authorization");
const router = (0, express_1.Router)();
router.use(authorization_1.isAuthenticated);
router.get('/register-face', faceRecognition_1.faceRegisterPage);
router.get('/authenticate-face', faceRecognition_1.faceAuthenticatePage);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZVJlY29nbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3dlYi9yb3V0ZXMvZmFjZVJlY29nbml0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWdDO0FBQ2hDLG9FQUF3RjtBQUN4RixtRUFBa0U7QUFFbEUsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBZSxDQUFDLENBQUM7QUFFNUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxrQ0FBZ0IsQ0FBQyxDQUFDO0FBQy9DLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsc0NBQW9CLENBQUMsQ0FBQztBQUV2RCxrQkFBZSxNQUFNLENBQUMifQ==