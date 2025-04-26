import Project from "../../models/Project.js"
import User from "../../models/User.js"


export const AssignProject = async (req, res) => {

    try{

    

    const {title, description, ownerId, startDate, assignedUserIds} = req.body 


    const project = await Project.create({
        title, 
        description,
        owner : ownerId,
        startDate
    })


    await User.updateMany(
        {_id: {$in: assignedUserIds}},
        {$push : {assignedProjects: project._id}}
    )

    return res.status(200).json({
        success:true,
        message:"Project assigned Successfully",
        data:project
    })
} catch(err){
    res.status(500).json({ error: error.message });

}

}

