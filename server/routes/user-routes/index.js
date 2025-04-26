import express from 'express'
import authenticate from '../../middleware/auth_middleware.js'
import { getProjectByUser } from '../../controllers/user-controllers/index.js'

const router = express.Router()

router.get('/getProject/:userId', authenticate, getProjectByUser)

export default router