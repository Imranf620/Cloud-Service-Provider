import { Router } from "express";
import { login, logout, register, updatePassword, updateUser,fetchMyProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router()

router.post("/register", register)
router.post("/login",login)
router.get("/logout",isAuthenticated,logout)
router.put("/update",isAuthenticated,updateUser)
router.put("/update/password",isAuthenticated,updatePassword)
router.get("/me",isAuthenticated,fetchMyProfile)






export default router