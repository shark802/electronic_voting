import { Router } from "express";
import { addIpAddress, getIpAddress, getAllIpAddress, removeIpAddress } from "../controllers/ipAddress";

const router = Router();

router.route('/ip-address')
    .post(addIpAddress)
    .get(getIpAddress)
    .put(removeIpAddress);

router.route('/ip-address/all')
    .get(getAllIpAddress);

export default router;
