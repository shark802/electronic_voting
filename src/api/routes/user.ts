import { Router } from "express";
import { getUserByIdNumber, newUserFunction, updateUserFunction } from "../controllers/user";
import { toUpperCase } from "../../middlewares/toUpperCase";

const router = Router();
router.use(toUpperCase);

router.route('/user/:id')
    .get(getUserByIdNumber)
    .put(updateUserFunction)

router.post('/user-new', newUserFunction);

export default router;