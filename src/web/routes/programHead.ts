import { Router } from 'express'
import { programHeadDashboardOverviewPage, programHeadDashboardVoteTallyPage } from '../controllers/programHead';

const router = Router();

router.get('/dashboard/overview', programHeadDashboardOverviewPage)
router.get('/dashboard/vote-tally', programHeadDashboardVoteTallyPage)

export default router;