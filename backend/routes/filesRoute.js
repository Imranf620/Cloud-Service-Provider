import { Router } from "express";
import { uploadFile ,getAllFiles, getVideoFiles, getImageFiles, getDocumentFiles, getOtherFiles} from "../controllers/filesController.js";
import upload from "../utils/multer.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

router.post("/upload", isAuthenticated, upload.single("file"),uploadFile)
router.get("/get/all", isAuthenticated,getAllFiles)
router.get("/get/videos", isAuthenticated,getVideoFiles)
router.get("/get/images", isAuthenticated,getImageFiles)
router.get("/get/documents", isAuthenticated,getDocumentFiles)
router.get("/get/others", isAuthenticated,getOtherFiles)









export default router;
