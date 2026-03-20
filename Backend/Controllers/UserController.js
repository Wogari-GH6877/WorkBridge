import UserModel from "../Models/UserModels.js";
import { isStrongPassword } from "../utils/isPasswordStrong.js";
import bcrypt from "bcrypt"
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