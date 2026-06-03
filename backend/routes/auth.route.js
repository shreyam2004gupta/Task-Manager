import express from "express"
import { signin, signup, userprofile } from "../controller/auth.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.post("/sign-up", signup)

router.post("/sign-in",signin)

router.get("/user-profile",verifyToken, userprofile)

export default router