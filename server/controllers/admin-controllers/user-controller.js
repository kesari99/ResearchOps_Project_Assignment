import User from "../../models/User.js"


export const getAllUsers = async (req, res) => {

    try{
        const allUsersList = await User.find({}).lean()

        const allusers = allUsersList.map(({password, ...rest}) =>  rest)

        return res.status(200).json({
            success:true,
            message:"Users fetched Successfully",
            data:allusers
        })

    }catch(err){
        console.log(err)
    }

}