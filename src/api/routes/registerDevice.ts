import { Router } from "express";
import { updateRegisterStatusFunction, declineRequestFunction, requestUuidFunction, checkUuidStatus } from "../controllers/registerDevice";

const router = Router();

router.route('/uuid')
    .post(requestUuidFunction)

router.route('/uuid/:id')
    .get(checkUuidStatus)
    .delete(declineRequestFunction)
    .put(updateRegisterStatusFunction)

export default router;