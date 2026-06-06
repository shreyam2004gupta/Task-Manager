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

export const deleteTask = async(req,res,next)=>{
    try{
      const task = await Task.findById(req.params.id)
       if(!task){
        return next(errorhandler(404,"Task not found !"))
       }
       await task.deleteOne()
       res.status(200).json({message:"Task deleted successfully !"})
    }catch(error){
        next(error)
    }
}

export const updateTaskStatus = async(req,res,next)=>{
    try{
      const task = await Task.findById(req.params.id)
      if(!task){
        return next(errorhandler(404,"task not found !"))
      }
      const isAssigned = task.assignedTo.some((userId)=> userId.toString() === req.user.id.toString())
      if(!isAssigned && req.user.role !== "admin"){
        return next(errorHandler(403, "unauthorized"))
      }
      task.status = req.body.status || task.status

       if(task.status === "Completed"){
        task.todoChecklist.forEach((item)=>item.completed=true)
       }
       await task.save()

       res.status(200).json({message: "Task status updated", task})
    }catch(error){
        next(error)
    }
}

export const updateTaskChecklist = async(req,res,next)=>{
    try{
       const {todoChecklist}=req.body
       const task = await Task.findById(req.params.id)
       if(!task){
        return next(errorhandler(404, "Task not found !"))
       }
       if(!task.assignedTo.includes(req.user.id) && req.user.role !=="admin"){
        return next(errorHandler(403 ,"Not authorized to update checklist"))
       }
       task.todoChecklist = todoChecklist

       const comletedCount =task.todoChecklist.filter((item)=>item.completed).length
       const totalItems = task.todoChecklist.length
       task.progress = totalItems >0 ? Math.round((compltedCount / totalItems)*100):0
       if(task.progress === 100){
        task.status = "Completed"
       }else if(task.progress >0){
        task.status ="In Progress"
       }else{
        task.status = "Pending"
       }
       await task.save()
       const updatedTask = await Task.findById(req.params.id).populate("assignedTo","name email profileImageUrl")
       res.status(200).json({message:"Task checklist updated",task:updatedTask})
    }catch(error){
        next(error)
    }
}

export const getDashboardData =async(req,res,next)=>{
    try{
     const totalTasks = await Task.countDocuments()
     const pendingTasks = await Task.countDocuments({status:"Pending"})
     const completedTasks = await Task.countDocuments({status:"Completed"})
     const overdueTasks = await Task.countDocuments({status: {$ne: "Completed"},
    dueDate:{$lt: new Date()}
    })
    const taskStatus =["Pending","In Progress","Completed"]

    const taskDistributionraw = await Task.aggregate([
        {
            $group:{
                _id:"$status",
                count:{$sum:1},
            },
        },
    ])

    const taskDistribution = taskStatus.reduce((acc,status)=>{
        const formattedKey = status.replace(/\s+/g, "")
        acc[formattedKey]= taskDistributionraw.find((item)=>item._id === status)?.count || 0

        return acc
    },{})

    taskDistributionraw["All"]= totalTasks

    const taskPriorities = ["Low", "Medium","High"]
    const taskPriorityLevelRaw= await Task.aggregate([
        {
        $group: {
            _id:"$priority",
            count:{$sum:1},
        },
    },
    ])

    const taskPriorityLevel = taskPriorities.reduce((acc,priority)=>{
        acc[priority] = taskDistributionraw.find((item)=> item._id ===  priority)?.count || 0
        return acc
    },{})
    const recentTasks = await Task.find().sort({createdAt:-1}).limit(10).select("title status priority dueDate ")
     res.status(200).json({
        statistics:{
          totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks
        },
        charts: {taskDistribution,
        taskPriorityLevel
        },
      recentTasks,
     })
    }catch(error){
        next(error)
    }
}

export const userDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Pending",
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Completed",
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    const taskStatuses = ["Pending", "In Progress", "Completed"];

    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});

    taskDistribution["All"] = totalTasks;

    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const taskPriorityLevel = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelRaw.find((item) => item._id === priority)?.count ||
        0;
      return acc;
    }, {});

    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevel,
      },
      recentTasks,
    });
  } catch (error) {
    next(error);
  }
};

