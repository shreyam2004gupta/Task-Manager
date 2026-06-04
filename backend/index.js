import express from "express"
import cors  from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import taskRoutes from "./routes/task.route.js"
import cookieParser from "cookie-parser"
import dns from 'dns';
dns.setServers(["1.1.1.1","8.8.8.8"]);

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database is connected")
  })
  .catch((err) => {
    console.error("database not connected",err.message)
  })

const app = express()

app.use(cors({
    origin : process.env.FRONT_END_URL || "http://localhost:5173",
    method:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
}))
app.use(express.json())

app.use(cookieParser())

app.listen(3000,()=>{
    console.log("server is running");
})

app.use("/api/auth",authRoutes)

app.use("/api/user",userRoutes)

app.use("/api/task",taskRoutes)

app.use((err,req,res,next)=>{
   const statusCode = err.statusCode || 500
   const message = err.message|| "Internal Server Error"

   res.status(statusCode).json({
    success:false,
    statusCode,
    message,
   })
})