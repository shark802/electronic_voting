import { Router } from "express";
import { getDepartmentObject } from "../controllers/department";

const router = Router();

router.get('/department', getDepartmentObject)

export default router;