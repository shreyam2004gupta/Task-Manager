import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js"
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
                { id: validUser._id ,role: validUser.role},
                process.env.JWT_SECRET,
            )

           const {password:pass, ...rest}=validUser._doc
           
           const isProd = process.env.NODE_ENV === "production";

           res
             .status(200)
             .cookie("access_token", token, {
               httpOnly: true,
               sameSite: "lax",
               secure: isProd,
             })
             .json(rest)
    }catch(error){
        next(errorHandler(500, error?.message || String(error)))
    }
}

export const userprofile = async (req,res,next)=>{
    try {
        const user = await User.findById(req.user.id)

        if(!user){
            return next(errorHandler(404,"user not found"))
        }
       const {password:pass, ...rest}=user._doc
       res.status(200).json(rest)
    }catch(error){
        next(error)
    }
}

export const updateUserprofile = async(req,res,next)=>{
    try{
        const user = await User.findByIdAndUpdate(req.user.id)
        if(!user){
            return next(errorHandler(404,"user not found"))
        }
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if(req.body.password){
            user.password = bcryptjs.hashSync(req.body.password , 10)
        }
        const updateUser = await user.save()
        const {password:pass, ...rest} = updateUser._doc
        res.status(200).json(rest)
    }catch(error){
        next(error)
    }
}

export const uploadImage = async (req,res,next)=>{
    try{
        if(!req.file){
            return next(errorHandler(400,"No file uploaded"))
        }
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        res.status(200).json({imageUrl})
    }catch(error){
        next(errorHandler(500, error?.message || String(error)))
    }
}

export const signout = async(req,res,next)=>{
    try{
      res.clearCookie("access_token").status(200).json("User has been logout successfully")
    }catch(error){
        next(error)
    }
}