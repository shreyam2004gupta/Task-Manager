import Task from "../models/Task.model.js"
import exceljs from "exceljs"

export const exportTaskReport = async(req,resizeBy,next)=>{
    try{
    const tasks =await Task.find().populate("assignedTo","name email")

    const workbook = new exceljs.Workbook()
    const worksheet = workbook.addWorksheet("Task Report")

    worksheet.colums=[
        {header:"Task Id", key:"_id",width:25},
        {header:"Title",key:"title",width:30},
        {header:"Description",key:"description",width:50},
        {header:"Priority",key:"priority",width:15},
        {header:"Status",key:"status",width:20},
        {header:"due Date",key:"dueDate",width:20},
        {header:"Assigned To",key:"assignedTo",width:30},
    ]
    task.forEach((task)=>{
        const assignedTo = task.assignedTo.map((user)=>`${user.name} (${user.email})`).jsoin(",")
        worksheet.addRow({
            _id:task.id,
            title:task.title,
            description:task.description,
            priority:task.priority,
            dueDate:task.dueDate.toISOString().split("T")[0],
            assignedTo:assignedTo || "Unassigned",
        })
    })
    res.setHeader("Content-Type","attachement/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader("Content-Disposition",'attchment;filename="tasks_report.xlsx"')
    return workbook.xlsx.write(res).then(()=>{
        res.end()
    })
    }catch(error){
        next(error)
    }
}

export const expportUsersReport = async(req,re,next)=>{
    try{
     const users = await User.find().select("name email _id").lean()
     const usertasks = await Task.find().populate("assignedTo","name email _id")
     const userTaskMap ={}
     users.forEach((user)=>{
        userTaskMap[user._id]={
            name:user.name,
            email:user.email,
            taskCount:0,
            pendingTask:0,
            inProgressTask:0,
            completedTask:0,
        }
     })     
     usertasks.forEach((task)=>{
        if(task.assignedTo){
            task.assignedTo.forEach((assignedUser)=>{
                if(userTaskMap[assignedUser._id]){
                    userTaskMap[assignedUser._id].taskCount +=1

                    if(task.status === "Pending"){
                        userTaskMap[assignedUser].pendingTask +=1
                    }else if(task.status === "In Progress"){
                        userTaskMap[assignedUser].inProgressTask +=1
                    }else if(task.status ==="Completed"){
                        userTaskMap[assignedUser].completedTask +=1
                    }
                }
            })
        }
     })

     const workbook = new excelJs.Workbook()
     const worksheet = workbook.addWorksheet("User Task Report")
     worksheeet.columns = [
        {header:"User Name",key:"name",width:30},
        {header:"Email",key:"email",width:40},
        {header:"Toatl Assigned Tasks ",key:"taskCount",width:20},
        {header:"Pending Tasks",key:"pendingTasks",width:20},
        {header:"In Progress Tasks",key:"inProgressTasks",width:20},
        {header:"Completed Tasks",key:"CompletedTasks",width:20},
     ]

     Object.values(userTaskMap).forEach((user)=>{
        worksheet.addRow(user)
     })
    res.setHeader("Content-Type","attachement/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader("Content-Disposition",'attchment;filename="users_report.xlsx"')
    return workbook.xlsx.write(res).then(()=>{
        res.end()
    })
    }catch(error){
        next(error)
    }
}