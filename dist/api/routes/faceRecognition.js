"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faceRecognition_1 = require("../controllers/faceRecognition");
const router = (0, express_1.Router)();
router.get('/face-service-domain', faceRecognition_1.getFaceRecognitionServiceDomain);
router.post('/register-face', faceRecognition_1.insertUserRegisterFaceInfo);
router.get('/register-face-status', faceRecognition_1.isClientRegisteredFace);
router.get('/save-face-filename', faceRecognition_1.getClientRegisteredFaceFilename);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZVJlY29nbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9yb3V0ZXMvZmFjZVJlY29nbml0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWlDO0FBQ2pDLG9FQUFzSztBQUV0SyxNQUFNLE1BQU0sR0FBRyxJQUFBLGdCQUFNLEdBQUUsQ0FBQztBQUV4QixNQUFNLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLGlEQUErQixDQUFDLENBQUM7QUFFcEUsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSw0Q0FBMEIsQ0FBQyxDQUFDO0FBQzFELE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsd0NBQXNCLENBQUMsQ0FBQztBQUM1RCxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLGlEQUErQixDQUFDLENBQUM7QUFFbkUsa0JBQWUsTUFBTSxDQUFDIn0=