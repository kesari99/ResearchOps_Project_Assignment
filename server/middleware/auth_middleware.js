import jwt from 'jsonwebtoken';



const verifyToken = (token, secretKey) => {
    return jwt.verify(token, secretKey)
}



const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;


    if(!authHeader){
        return res.status(401).json({
            message:'User is not authenthicated',
            success:false
        })
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = verifyToken(token, "JWT_SECRET");
        req.user = payload;
        console.log(req.user, " authenticate user")
        next();
      } catch (error) {
        return res.status(401).json({
          message: "Invalid or expired token",
          success: false,
        });
      }
}

export default authenticate;