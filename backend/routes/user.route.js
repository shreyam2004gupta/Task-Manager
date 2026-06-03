import express from "express"
import { adminOnly, verifyToken } from "../utils/verifyUser.js"
import { getusers } from "../controller/user.controller.js"

const router = express.Router()

router.get ("/get-users", verifyToken, adminOnly ,getusers)

export default router