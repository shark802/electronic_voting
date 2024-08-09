import { Router } from "express";
import { updateRegisterStatusFunction, declineRequestFunction, requestUuidFunction } from "../controllers/registerDevice";

const router = Router();

router.route('/uuid')
    .post(requestUuidFunction)

router.route('/uuid/:id')
    .delete(declineRequestFunction)
    .put(updateRegisterStatusFunction)

export default router;