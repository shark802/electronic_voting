import { Router } from "express";
import { landingPage, loginPage } from "../controllers/generalAccess";

const router = Router()

router.get("/", landingPage)
router.get("/login", loginPage)

export default router