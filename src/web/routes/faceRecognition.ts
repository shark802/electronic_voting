import { Router } from 'express'
import { faceRegisterPage } from '../controllers/faceRecognition';

const router = Router();

router.get('/register-face', faceRegisterPage);

export default router;