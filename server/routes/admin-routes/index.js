import express from 'express'
import { getAllUsers } from '../../controllers/admin-controllers/user-controller.js'
import { AssignProject } from '../../controllers/admin-controllers/assign-project-controller.js'
import authenticate from '../../middleware/auth_middleware.js'


const router = express.Router()


router.get('/getallusers', authenticate, getAllUsers)
router.post('/createproject',authenticate, AssignProject)



export default router