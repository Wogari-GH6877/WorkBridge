import UserModel from "../Models/UserModels.js";
import { isStrongPassword } from "../utils/isPasswordStrong.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
export const SignUp = async(req,res)=>{

    try {
        const {name,email,password,bio,skills}=req.body;

        // validate important things

        if(!name || ! email || !password){
            return res.status(400).json({
                success:false,
                message:"Required fields Missing"
            })
        }

        
        // chaeck password length
        if(!isStrongPassword(password)){
            return res.status(400).json({
                success:false,
                message:"Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
            })
        }


        // check if the user allready exist
       
        const ExistingUser=await UserModel.findOne({email});

        if(ExistingUser){
            return res.status(409).json({
                success:false,
                message:"User Already exist"
            });

        
        }

        // hash the password

        const hashPassword=await bcrypt.hash(password,10);

        const NewUser=await UserModel.create({name,email,password:hashPassword,bio,skills});


        res.json({
            success:true,
             message: "User created successfully",
            user:{
                id:NewUser._id,
                name:NewUser.name,
                email:NewUser.email
            },
            
        })

    } catch (error) {
        
        //  Handle duplicate key error (important under high load)
        if (error.code === 11000) {
        return res.status(409).json({ message: "Email already exists" });
        }

        res.status(500).json({ message: "Server error", error });
        }
}

export const Login= async(req,res)=>{
    try {
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Required Fields Missing"
            })
        }

        const user=await UserModel.findOne({email});
        
        // Check is the user exists
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User Not Exist"
            })
        }
        

        // check if the the account is Locked

        if(user.lockUntil && user.lockUntil > Date.now()){
            return res.status(403).json({
                success:false,
                message: `Account locked. Try again after 15 min`
            })
            
        }else if (user.lockUntil && user.lockUntil <= Date.now()) {
                // Lock expired, reset attempts
                user.failedAttempts = 0;
                user.lockUntil = null;
                await user.save();}

        // Compare password
        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            user.failedAttempts+=1;
            if(user.failedAttempts>=5){
                
                user.lockUntil=Date.now() + 5*1000*60;
            
            }

            await user.save();

            return res.status(401).json({
             success: false,
             message: `Invalid credentials , ${5 - user.failedAttempts} Attempts left`
             });
        }

        // for succces

        user.failedAttempts = 0;
        user.lockUntil = null;

        await user.save();


        // Jwt Token

        const token= jwt.sign({
            id:user._id
        },"secret",{expiresIn:"1d"})


         //  Send response
            res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
            });

    } catch (error) {
        console.error("something is wrong", error);

        res.status(500).json({ message: "Server error", error });
    }
}