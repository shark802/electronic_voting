import { Router } from 'express';
import { getFaceRecognitionServiceDomain } from '../controllers/faceRecognition';

const router = Router();

router.get('/face-service-domain', getFaceRecognitionServiceDomain);

export default router;