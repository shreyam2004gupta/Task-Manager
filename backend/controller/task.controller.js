import Task from "../models/Task.model.js";
import { errorHandler } from "../utils/error.js";

export const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todochecklist,
    } = req.body;

    if (!Array.isArray(assignedTo)) {
      return next(
        errorHandler(400, "assignedTo must be an array of user Ids")
      );
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todochecklist,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "task craeted successfully", task });
  } catch (error) {
    next(error);
  }
}

export const getTasks = async (req,res,next)=>{
    try{
        const {status}=req.query

        let filter={}

        if(status){
            filter.status =status
        }
        let tasks
        if(req.user.role === "admin"){
            tasks = await Task.find(filter).populate("assignedTo","name email profileImageUrl")
        }else{
            tasks = await Task.find({
                ...filter,
                assignedTo:req.user.id,
            }).populate("assignedTo","name email profileImageUrl")
        }
        tasks = await Promise.all(tasks.map(async(task)=>{
            const completedCount =task.todoChecklist.filter((item)=>item.completed).length
            return{...tasks._docs,completedCount:completedCount}
        })
    )

    const allTasks = await Task.countDocuments(
        req.user.role === "admin" ? {} : { assignedTo: req.user.id }
    )

    const pendingTasks = await Task.countDocuments({
        ...filter,
        status:"Pending",
        ...(req.user.role !== "admin" && {assignedTo : req.user.id}),
    })
    const inProgressTasks = await Task.countDocuments({
        ...filter,
        status:"In Progress",
        ...(req.user.role !== "admin" && {assignedTo : req.user.id}),
    })
    const completedTasks = await Task.countDocuments({
        ...filter,
        status:"Completed",
        ...(req.user.role !== "admin" && {assignedTo:req.user.id}),
    })
    res.status(200).json({
        tasks,
        statusSummary:{
            all:allTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
        },
    })

    }catch(error){
        next(error)
    }
}

export const gettaskById = async (req,res,next)=>{
    try{
        const task = await Task.findById(req.params.id).populate("assignedTo","name email profileImageUrl")
        if(!task){
            return next(errorHandler(404,"task not found"))
        }
        res.status(200).json(task)
    }catch(error){
        next(error)
    }
}

export const updateTask = async (req,res,next)=>{
    try{
        const task = await Task.findById(req.params.id)
        if(!task){
            return next(errorHandler(404,"Task not found !"))
        }
        task.title = req.body.title || task.title
        task.description = req.body.description || task.description
        task.priority = req.body.priority || task.priority
        task.duedate = req.duedate || task.duedate
        task.taskChecklist = req.body.taskChecklist || task.taskChecklist
        task.attachements = req.body.attchements || task.attchements

        if(req.body.assignedTo){
            if(!Array.isArray(req.body.assignedTo)){
                return next(
                    errorHandler(400,"assignedTo must be an Array of user IDs")
                )
            }
            task.assignedTo = req.body.assignedTo
        }
        const updateTask = await task.save()
        return res.status(200).json({updateTask,message:"Task updated successfully !!"})
    }catch(error){
        next(error)
    }
}