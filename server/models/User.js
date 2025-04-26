import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userName:String,
    userEmail:String,
    password:String,
    role:String,
    assignedProjects:[{type:mongoose.Schema.Types.ObjectId, ref:'Project'}]

})

const User = mongoose.model('User',UserSchema);

export default User;