import Task from "../models/Task.model.js"
import User from "../models/user.model.js"

export const getusers = async (req,res,next)=>{
    try{
      const users = await User.find({role:"user"}).select("-password")
     
      const userwithTaskCounts = await Promise.all(users.map(async(user)=>{
        const pendingTasks = await Task.countDocuments({
            assignedTo:user._id,
            status:"pending",
        }) 
        const inProgressTask = await Task.countDocuments({
            assignedTo:user._id,
            status:"in-progress",
        })
        const CompletedTask = await Task.countDocuments({
            assignedTo:user._id,
            status:"completed",
        })
        return{
            ...user._doc,
            pendingTasks,
            inProgressTask,
            CompletedTask,
        }
      }))
       res.status(200).json(userwithTaskCounts)
    }catch(error){
        next(error)
    }
}

export const getUserById = async (req,res,next)=>{
    try{
        const user = await User.findById(req.params.id).select("-password")

        if(!user){
            return next(errorHandler(404,"user not found"))
        }
        res.status(200).json(user)
    }catch(error){
        next(error)
    }
}