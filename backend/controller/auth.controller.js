import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../error.js"
import jwt from "jsonwebtoken"

export const signup =async(req,res,next) => {
    const {name,email,password,profileImageUrl, adminJoinCode} =req.body

    if(!name || !email || !password || name ==="" || email === "" || password === ""){
        return next(errorHandler(400, "All fields are required"))
    }

    const isAlreadyExist =await User.findOne({email})

    if(isAlreadyExist){
       return next(errorHandler(400,"User already exists"))
    }

    let role = "user"

    if(adminJoinCode && adminJoinCode === process.env.ADMIN_JOIN_CODE){
        role ="admin"
    }
    const hashPassword = bcryptjs.hashSync(password,10)

    const newuser = new User({
        name,email,password:hashPassword,profileImageUrl,role
    })
    try{
        await newuser.save()
        res.json("Signup successful")
    } catch (error){
     next(errorHandler(500, error?.message || String(error)))
    }
}

export const signin = async(req,res,next)=> {
    try{
       const{ email,password} =req.body
         if(!email || !password || email ==="" || password === ""){
            return next(errorHandler(400,"All fields are required"))
         }
         const validUser = await User.findOne({email})
            if(!validUser){
                return next(errorHandler(404, "User not found"))
            }
            const validPassword = bcryptjs.compareSync(password, validUser.password)

            if(!validPassword){
                return next(errorHandler(400, "wrong password"))
            }
            const token = jwt.sign(
                { id: validUser._id},
                process.env.JWT_SECRET,
            )

           const {password:pass, ...rest}=validUser._doc
           
           res.status(200).cookie("access_token",token,{httpOnly:true}).json(rest)
    }catch(error){
        next(errorHandler(500, error?.message || String(error)))
    }
}