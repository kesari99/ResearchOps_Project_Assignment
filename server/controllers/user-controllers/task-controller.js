import Task from "../../models/Task.js";
import Project from "../../models/Project.js";
import mongoose from 'mongoose';



export const GetAllTasksForProject = async (req, res) => {
    
        try {
          const { projectId } = req.params;
          
          const tasks = await Task.find({ project: projectId })
            .populate('assignedUser', 'userName userEmail')
            .sort({ lastUpdated: -1 });
          
          res.status(200).json({
            success: true,
            data: tasks
          });
        } catch (err) {   
          console.error('Error fetching project tasks:', err);
          res.status(500).json({
            success: false,
            error: err.message
          });
        }
    
}


export const UpdateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, historyEntry } = req.body;
    
    const task = await Task.findByIdAndUpdate(
      taskId,
      { 
        status,
        lastUpdated: new Date(),
        $push: { history: historyEntry }
      },
      { new: true }
    ).populate('assignedUser', 'userName userEmail');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error('Error updating task status:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

export const CreateNewTask = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const { 
        title, 
        description, 
        projectId, 
        assignedUserId, 
        priority, 
        tags, 
        deadline, 
        researchTopic, 
        status 
      } = req.body;
  
      
      // Create the task
      const newTask = await Task.create([{
        title,
        description,
        project: projectId,
        assignedUser: assignedUserId,
        priority,
        tags,
        deadline,
        researchTopic,
        status: status || 'To Do',
        lastUpdated: new Date(),
        history: [{
          timestamp: new Date(),
          user: req.user._id,
          newStatus: status || 'To Do',
          comment: 'Task created'
        }]
      }], { session });
      
      // Add task to project
      await Project.findByIdAndUpdate(
        projectId,
        { $push: { tasks: newTask[0]._id } },
        { session }
      );
      
      await session.commitTransaction();
      
      // Populate assigned user before returning
      const populatedTask = await Task.findById(newTask[0]._id)
        .populate('assignedUser', 'userName userEmail');
      
      res.status(201).json({
        success: true,
        data: populatedTask
      });
    } catch (err) {
      await session.abortTransaction();
      console.error('Error creating task:', err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    } finally {
      session.endSession();
    }
  }

export const UpdateTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;
    
    const task = await Task.findByIdAndUpdate(
      taskId,
      { 
        ...updateData,
        lastUpdated: new Date() 
      },
      { new: true }
    ).populate('assignedUser', 'userName userEmail');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

export const DeleteTask = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const { taskId } = req.params;
      
      // Find task to get project ID
      const task = await Task.findById(taskId);
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
      
      // Remove task from project
      await Project.findByIdAndUpdate(
        task.project,
        { $pull: { tasks: taskId } },
        { session }
      );
      
      // Delete the task
      await Task.findByIdAndDelete(taskId, { session });
      
      await session.commitTransaction();
      
      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (err) {
      await session.abortTransaction();
      console.error('Error deleting task:', err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    } finally {
      session.endSession();
    }
  }


 