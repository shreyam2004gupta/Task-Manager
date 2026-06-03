import express from "express"
import { adminOnly, verifyToken } from "../utils/verifyUser.js"
import { getUserById, getusers } from "../controller/user.controller.js"

const router = express.Router()

router.get ("/get-users", verifyToken, adminOnly ,getusers)

router.get("/:id",verifyToken,getUserById)

export default router