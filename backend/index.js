import express from "express"
import cors  from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
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

app.listen(3000,()=>{
    console.log("server is running");
})