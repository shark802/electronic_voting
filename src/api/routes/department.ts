import { Router } from "express";
import { getDepartmentObject, getDepartmentPrograms } from "../controllers/department";

const router = Router();

router.get('/department', getDepartmentObject)
router.get('/program', getDepartmentPrograms)

export default router;