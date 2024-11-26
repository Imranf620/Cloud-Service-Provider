import { Router } from "express";
import { getPricing, updatePackage } from "../controllers/paymentController.js";



const router = Router()

router.post("/", updatePackage)
router.get("/", getPricing)


export default router