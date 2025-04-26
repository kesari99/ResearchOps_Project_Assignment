import mongoose from "mongoose";

const MeetingNoteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    taskUpdates: [
      {
        taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
        yesterday: String,
        today: String,
        blockers: String
      }
    ],
    generalNote: String,
    createdAt: { type: Date, default: Date.now }
  });


const MeetingNote =  mongoose.model('MeetingNote', MeetingNoteSchema)

export default MeetingNote
  