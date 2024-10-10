import { Router } from "express";
import { addDepartment, addProgram, getAllDepartments, getDepartmentObject, getDepartmentPrograms, getProgramSection, removeDepartment, setDepartmentMaxSenatorVote } from "../controllers/department";

const router = Router();

router.route('/department')
    .post(addDepartment)
    .get(getDepartmentObject)


router.put('/department/senator-max-vote', setDepartmentMaxSenatorVote);
router.put('/department/:id', removeDepartment);

router.get('/departments', getAllDepartments)
router.get('/program', getDepartmentPrograms)
router.get('/section', getProgramSection)

router.post('/program', addProgram);

export default router;