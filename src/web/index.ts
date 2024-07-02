import {Router} from "express";
import generalAccess from "./routes/generalAccess";
import adminRoutes from "./routes/admin";
import voterRoutes from "./routes/voter";

const router = Router();

router.use(generalAccess)
router.use("/admin", adminRoutes);
router.use(voterRoutes);

export default router;
