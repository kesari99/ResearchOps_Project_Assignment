import mongoose from 'mongoose';
import Task from '../../models/Task.js';
import MeetingNote from '../../models/MeetingNote.js'


// Create new meeting notes
export const createMeetingNotes = async (req, res) => {
  try {
    const { userId, projectId, taskUpdates, generalNote } = req.body;
    
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    
    // Create meeting note record
    const meetingNote = new MeetingNote({
      userId,
      projectId: projectId || null,
      taskUpdates,
      generalNote
    });
    
    await meetingNote.save();
    
    // Update tasks with the meeting notes
    for (const update of taskUpdates) {
      if (update.taskId && (update.yesterday || update.today || update.blockers)) {
        const historyEntry = {
          timestamp: new Date(),
          user: userId,
          comment: `Daily meeting update: ${[
            update.yesterday ? `Yesterday: ${update.yesterday}` : '',
            update.today ? `Today: ${update.today}` : '',
            update.blockers ? `Blockers: ${update.blockers}` : ''
          ].filter(Boolean).join(' | ')}`
        };
        
        // Update task with history
        await Task.findByIdAndUpdate(update.taskId, {
          $push: { history: historyEntry },
          lastUpdated: new Date()
        });
        
        // If task has blockers, consider updating status or adding a flag
        if (update.blockers) {
          // Optional: Add logic to flag or update task status if there are blockers
        }
      }
    }
    
    return res.status(201).json({ 
      success: true, 
      message: 'Meeting notes saved successfully',
      data: meetingNote
    });
    
  } catch (error) {
    console.error('Error creating meeting notes:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get meeting notes by user ID
export const getUserMeetingNotes = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    
    // Find all meeting notes for this user
    const meetingNotes = await MeetingNote.find({ userId })
      .populate('projectId', 'title')
      .populate('taskUpdates.taskId', 'title')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({ success: true, data: meetingNotes });
    
  } catch (error) {
    console.error('Error fetching user meeting notes:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get meeting notes by project ID
export const getProjectMeetingNotes = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }
    
    // Find all meeting notes for this project
    const meetingNotes = await MeetingNote.find({ projectId })
      .populate('userId', 'userName')
      .populate('taskUpdates.taskId', 'title')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({ success: true, data: meetingNotes });
    
  } catch (error) {
    console.error('Error fetching project meeting notes:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};