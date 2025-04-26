import mongoose from "mongoose";
import Task from "../../models/Task.js";
import User from "../../models/User.js";

export const getProjectByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId)
            .populate({
                path: 'assignedProjects',
                populate: { 
                    path: 'owner', 
                    select: 'userName userEmail' 
                }
            });
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        
        res.status(200).json({ 
            success: true,
            data: user.assignedProjects 
        });
        
    } catch(err) {
        console.error('Error fetching user projects:', err);
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
}

export const getUserTasks = async (req, res) => {
    try {
      const userId = req.params.userId;
      
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID' });
      }
      
      const tasks = await Task.find({ assignedUser: userId })
        .populate('project', 'title description')
        .populate('assignedUser', 'userName')
        .sort({ lastUpdated: -1 });
      
      return res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      console.error('Error in getUserTasks controller:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };