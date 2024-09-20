import { Router } from 'express';
import { previewVoterParticipationReports } from '../controllers/report';

const router = Router();

router.get('/voter/:id', previewVoterParticipationReports);
// router.get('/voted/:id', previewVotedReports);

export default router;