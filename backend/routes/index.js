import { Router } from "express";
import userRoute from "./userRoute.js"
import filesRoute from "./filesRoute.js"
import trashRoute from "./trashRoute.js"


const router = Router()

router.use("/api/v1/user",userRoute )
router.use("/api/v1/files",filesRoute )
router.use("/api/v1/trash",trashRoute )


export default router