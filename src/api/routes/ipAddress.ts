import { Router } from "express";
import { addIpAddress, getIpAddress } from "../controllers/ipAddress";

const router = Router();

router.route('/ip-address')
    .post(addIpAddress)
    .get(getIpAddress);

export default router;
