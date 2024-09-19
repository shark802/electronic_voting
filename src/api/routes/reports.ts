import Router from 'express';
import { generateNotVotedReportInPdf } from '../controllers/reports';

const router = Router();

router.get('/pdf-report/not-voted/:id', generateNotVotedReportInPdf);

export default router