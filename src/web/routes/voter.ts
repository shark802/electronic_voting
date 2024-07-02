import { Router } from "express";
import { electionPage } from "../controllers/voter";

const router = Router();

router.get('/election', electionPage);

export default router;