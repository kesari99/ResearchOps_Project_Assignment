import mongoose from "mongoose";
import Project from "../../models/Project.js";

export const GetProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID format'
            });
        }

        const project = await Project.findById(projectId)
            .populate('owner', 'userName userEmail')
            .populate({
                path: 'tasks',
                select: '_id title status priority',
                options: { sort: { 'lastUpdated': -1 } }
            });
        
        console.log('Query result:', project); 
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
                details: `Searched for ID: ${projectId}`
            });
        }
        
        res.status(200).json({
            success: true,
            data: project
        });
    } catch (err) {
        console.error('Error fetching project details:', err);
        res.status(500).json({
            success: false,
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
}