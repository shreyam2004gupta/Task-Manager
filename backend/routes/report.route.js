import express from "express"
import { adminOnly, verifyToken } from "../utils/verifyUser"
import { exportTaskReport, expportUsersReport } from "../controller/report.controller"

const router = express.Router()

router.get("/export/tasks",verifyToken,adminOnly,exportTaskReport)

router.get("/export/users",verifyToken,adminOnly,expportUsersReport)

export default router

