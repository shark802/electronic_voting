import Router from "express";
import { loginFunction } from "../controllers/auth";

const router = Router();

router.post("/login", loginFunction);

export default router;