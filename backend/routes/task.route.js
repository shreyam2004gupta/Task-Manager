import express from "express"
import { adminOnly, verifyToken } from "../utils/verifyUser.js"
import { createTask, gettaskById, getTasks, updateTask } from "../controller/task.controller.js"

const router = express.Router()

router.post("/create",verifyToken,adminOnly,createTask)

router.get("/",verifyToken,getTasks)

router.get("/:id", verifyToken, gettaskById)

router.get("/:id", verifyToken, updateTask)
export default router