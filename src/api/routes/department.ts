import { Router } from "express";
import { addDepartment, getAllDepartments, getDepartmentObject, getDepartmentPrograms, getProgramSection } from "../controllers/department";

const router = Router();

router.route('/department')
    .post(addDepartment)
    .get(getDepartmentObject)

router.get('/departments', getAllDepartments)
router.get('/program', getDepartmentPrograms)
router.get('/section', getProgramSection)

export default router;