import { Router } from "express";
import { acceptRequestFunction, declineRequestFunction, requestUuidFunction } from "../controllers/registerDevice";

const router = Router();

router.route('/uuid')
    .post(requestUuidFunction)
    .put(acceptRequestFunction)

router.route('/uuid/:id')
    .delete(declineRequestFunction);

export default router;