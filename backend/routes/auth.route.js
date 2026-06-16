import express from "express"
import { signin, signout, signup, updateUserprofile, uploadImage, userprofile } from "../controller/auth.controller.js"
import { verifyToken } from "../utils/verifyUser.js"
import upload from "../utils/multer.js"

const router = express.Router()

router.post("/sign-up", signup)

router.post("/sign-in",signin)

router.get("/user-profile",verifyToken, userprofile)

router.put("/update-profile",verifyToken, updateUserprofile)

router.post("/upload-image",upload.single("image"),uploadImage)

router.post("/sign-out",signout)

export default router