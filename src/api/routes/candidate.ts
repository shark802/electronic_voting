import { Router } from "express";
import { addCandidateFunction, deleteCandidateFunction, updateCandidateFunction } from "../controllers/candidate";
import { toUpperCase } from "../../middlewares/toUpperCase";

const router = Router();

router.use(toUpperCase);

router.post("/candidate", addCandidateFunction);

router
    .route("/candidate/:id")
    .put(updateCandidateFunction)
    .delete(deleteCandidateFunction)

export default router;