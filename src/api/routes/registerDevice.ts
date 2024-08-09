import { Router } from "express";
import { declineRequestFunction, requestUuidFunction } from "../controllers/registerDevice";

const router = Router();

router.route('/uuid')
    .post(requestUuidFunction)

router.route('/uuid/:id')
    .delete(declineRequestFunction);

export default router;