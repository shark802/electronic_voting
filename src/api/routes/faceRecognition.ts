import { Router } from 'express';
import { getFaceRecognitionServiceDomain, insertUserRegisterFaceInfo } from '../controllers/faceRecognition';

const router = Router();

router.get('/face-service-domain', getFaceRecognitionServiceDomain);

router.post('/register-face', insertUserRegisterFaceInfo)

export default router;