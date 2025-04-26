import express from 'express'
import { loginUser, registerUser } from '../../controllers/auth-controller/index.js'
import authenticate from '../../middleware/auth_middleware.js'

const router = express.Router()


router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/check-auth', authenticate, (req, res) => {
    const user = req.user;
    res.status(200).json({
        message:'User is authenticated',
        success:true,
        data:user
    })
})


export default router