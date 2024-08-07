import { Router } from "express";
import { requestUuidFunction } from "../controllers/registerDevice";

const router = Router();

router.post('/uuid', requestUuidFunction);

export default router;