import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Resume from '../models/Resume.js'

const genrateToken = (userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'7d'})
    return token;
}
//function for signup
//Post: /api/user/signup
export const registerUser = async (req, res)=>{
    try {
        const{name, email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:'Missing required field'})
        }
        //check if user already exist
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message:"User already exist"})
        }
        const hashPassword = await bcrypt.hash(password,10)
        const newUser = await User.create({
            name,email,password:hashPassword
        })
       //return success message
       const token = genrateToken(newUser._id)
       user.password = undefined;
       return res.status(200).json({message:'User created successful',token,user:newUser})

    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}

//function for login
//Post: /api/user/login
export const loginUser = async (req, res)=>{
    try {
        const{email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:'Missing required field'})
        }
        //check if user already exist
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid email and password"})
        }
       
       if(!user.comparePassword(password)){
             return res.status(400).json({message:"Invalid email and password"})
       }
       //return success message
       const token = genrateToken(user._id)
       user.password = undefined;
       return res.status(200).json({message:'Login successful',token,user})

    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}
// function to get user by id
//GET: /api/user/data
export const getUserById = async(req,res)=>{
    try {
        const userId = req.userId;
        //check if user exist
        const user = await User.findById(userId)
        if(!user){
            return res.status(400).json({message: 'user not found'})
        }
        // if user exist
        user.password = undefined;
        return res.status(200).json({user})
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
} 
//function for getting user resume
//GET: /api/user/resumes
export const getUserResumes = async (req, res)=>{
    try {
        const userId = req.userId;
        const resumes =  await Resume.find({userId});
        return res.status(200).json({resumes});
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}