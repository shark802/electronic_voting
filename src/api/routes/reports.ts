import Router from 'express';
import { generateVoterReportInPdf } from '../controllers/reports';

const router = Router();

router.get('/pdf-report/voter/:id', generateVoterReportInPdf);

export default router