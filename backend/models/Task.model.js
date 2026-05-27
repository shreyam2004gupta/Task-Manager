import mongoose from "mongoose";

const TaskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    discription:{
        type:String,
    },
    priority:{
        type:String,
        enum:["Low","Medium","High"],
        default:"Low",
    },
    status:{
        type:String,
        enum:["Pending","In Progress","Completed"],
        default:"Pending",
    },
    dueDate:{
        type:Date,
        required:true,
    },
    assignedTo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },],
    createdBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },],
    attachements:[
        {
            type:String,
        },
    ],
    progress:{type:Number, default:0},
},
{timestamps:true})

const Task=mongoose.model("Task",TaskSchema)

export default Task

