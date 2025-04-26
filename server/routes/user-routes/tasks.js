import express from 'express';
import authenticate from '../../middleware/auth_middleware.js';
import { CreateNewTask, DeleteTask, GetAllTasksForProject, UpdateTaskDetails, UpdateTaskStatus } from '../../controllers/user-controllers/task-controller.js';
import { getUserTasks } from '../../controllers/user-controllers/index.js';

const router = express.Router();

// Get all tasks for a project
router.get('/project/:projectId',authenticate,GetAllTasksForProject);

// Create a new task
router.post('/', authenticate,  CreateNewTask);

// Update task status
router.patch('/:taskId/status',authenticate, UpdateTaskStatus);

// Update task details
router.put('/:taskId',authenticate, UpdateTaskDetails);

router.delete('/:taskId',authenticate, DeleteTask);

router.get('/user/:userId',authenticate , getUserTasks);

export default router;