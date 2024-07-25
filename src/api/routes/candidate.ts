import { Router } from "express";
import { addCandidateFunction, deleteCandidateFunction, getManageCandidates, updateCandidateFunction } from "../controllers/candidate";
import { toUpperCase } from "../../middlewares/toUpperCase";

const router = Router();

router.use(toUpperCase);

router.post("/candidate", addCandidateFunction);

router
    .route("/candidate/:id")
    .put(updateCandidateFunction)
    .delete(deleteCandidateFunction)

router.get("/candidate", getManageCandidates);

export default router;