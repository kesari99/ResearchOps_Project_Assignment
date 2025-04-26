import mongoose from "mongoose";


const projectScheme = new mongoose.Schema({
    title:String,
    description:String,
    owner : {type : mongoose.Schema.Types.ObjectId, ref:'User'},
    startDate : Date,
    status:{
        type:String,
        enum:['Not Started', 'In Progress', 'Completed'],
        default:'Not Started'
    },
    tasks: [{type:mongoose.Schema.Types.ObjectId, ref:'Task'}]
})

const Project = mongoose.model('Project', projectScheme)

export default Project 