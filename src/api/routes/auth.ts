import Router from "express";
import { loginFunction, logoutFunction } from "../controllers/auth";

const router = Router();

router.post("/login", loginFunction);
router.post("/logout", logoutFunction)

export default router;