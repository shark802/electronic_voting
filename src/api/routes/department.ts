import { Router } from "express";
import { getDepartmentObject, getDepartmentPrograms, getProgramSection } from "../controllers/department";

const router = Router();

router.get('/department', getDepartmentObject)
router.get('/program', getDepartmentPrograms)
router.get('/section', getProgramSection)

export default router;