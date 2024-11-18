import { Router } from "express";
import userRoute from "./userRoute.js"

const router = Router()

router.use("/api/v1",userRoute )

export default router