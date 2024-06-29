import {Router} from "express"
import generalAccess from "./routes/generalAccess"
import adminRoutes from "./routes/admin"

const router = Router()

router.use(generalAccess)
router.use("/admin", adminRoutes)

export default router
