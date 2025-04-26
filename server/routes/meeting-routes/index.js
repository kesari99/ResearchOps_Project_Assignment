import express from 'express'
import authenticate from '../../middleware/auth_middleware.js'
import { createMeetingNotes,getUserMeetingNotes,getProjectMeetingNotes } from '../../controllers/meetingnote-controllers/index.js';

const router = express.Router()

// Create meeting notes
router.post('/',authenticate , createMeetingNotes);

// Get meeting notes by user
router.get('/user/:userId', authenticate, getUserMeetingNotes);

// Get meeting notes by project
router.get('/project/:projectId', authenticate, getProjectMeetingNotes);


export default router