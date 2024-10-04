import { Router } from 'express';
import { previewVoterParticipationReports, programHeadVoterParticipationReport } from '../controllers/report';

const router = Router();

router.get('/voter/:id', previewVoterParticipationReports);
router.get('/program/voter/:id', programHeadVoterParticipationReport);

export default router;