import { Router } from "express";
import { addCandidateFunction, deleteCandidateFunction, getAllcandidatesInActiveElection, getCandidateById, getManageCandidates, getUserCandidateData, updateCandidateFunction, updateCandidateStatus } from "../controllers/candidate";
import { toUpperCase } from "../../middlewares/toUpperCase";

const router = Router();

router.use(toUpperCase);

router.route('/candidate')
    .post(addCandidateFunction)

router.route('/candidate/data')
    .get(getAllcandidatesInActiveElection)

router
    .route("/candidate/:id")
    .put(updateCandidateFunction)
    .delete(deleteCandidateFunction)
    .get(getCandidateById)

router.get("/candidate", getManageCandidates);
router.get('/candidate-info', getUserCandidateData);
router.put("/candidate/status/:id", updateCandidateStatus);
export default router;