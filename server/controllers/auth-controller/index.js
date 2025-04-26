import User from "../../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



export const registerUser = async (req, res, next) => {
    try{
        const {userName, userEmail, password, role} = req.body;

        if(!userName || !userEmail || !password){
            return res.status(400).json({
                message:'All fields are required',
                success:false
            })
        }
        console.log('req.body', req.body);

        const existingUser = await User.findOne({$or : [{userEmail}, {userName}]});

        if (existingUser){
            return res.status(400).json({
                message:'User name or Email already exists',
                success:false
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName:userName,
            userEmail:userEmail,
            password:hashPassword,
            role:role
        })

        await newUser.save();

        res.status(200).json({
            success:true,
            message:'User registerd successfully',
            user:newUser
        })

    }catch(err){
        next(err)

    }
}

export const loginUser = async (req, res, next) => {
    
    const {userEmail, password} = req.body;

   const checkUser = await User.findOne({userEmail})

   if(!checkUser || !(await bcrypt.compare(password, checkUser.password))){
       return res.status(401).json({
           message:'Invalid credentials',
           success:false
       })
   }    

   const accessToken = jwt.sign({
    _id: checkUser._id,
    userName: checkUser.userName,
    userEmail: checkUser.userEmail,
    role: checkUser.role
   }, 'JWT_SECRET', {expiresIn: '1d'});

   res.status(200).json({
         success:true,
         message:'User logged in successfully',
         data:accessToken,
         user:{
            _id: checkUser._id,
            userName: checkUser.userName,
            userEmail: checkUser.userEmail,
            role: checkUser.role
        }
   })
}

