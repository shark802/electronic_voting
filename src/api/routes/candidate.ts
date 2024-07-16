import { Router } from "express";
import { addCandidateFunction } from "../controllers/candidate";

const router = Router();

router.post("/candidate", addCandidateFunction);

export default router;