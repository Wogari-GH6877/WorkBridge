import UserModel from "../Models/UserModels.js";
import { isStrongPassword } from "../utils/isPasswordStrong.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import JobModel from "../Models/JobModels.js";
import ApplicationModel from "../Models/ApplicationModel.js";

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
            userId:user._id
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


// controllers/jobController.js

export const createJob = async (req, res) => {
  try {
    // 1. Destructure ALL the new fields from the request body
    const { 
      title, 
      description, 
      budget, 
      skillsRequired, 
      deadline, 
      location, 
      worktime, 
      experienceLevel, 
      responsibilities, 
      applicantsCount 
    } = req.body;

    // 2. Updated Validation (Adding Location and Worktime as required)
    if (!title || !description || !budget || !location || !worktime) {
      return res.status(400).json({
        success: false,
        message: "Title, description, budget, location, and job type are required"
      });
    }

    console.log("Creating job for User ID:", req.userId);

    // 3. Create job with all the enriched data
    const job = await JobModel.create({
      title,
      description,
      budget,
      skillsRequired, // Received as an array from frontend
      responsibilities, // Received as an array from frontend
      deadline,
      location,
      worktime,
      experienceLevel,
      applicantsCount: applicantsCount || 0, // Fallback to 0 if not provided
      createdBy: req.userId 
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job
    });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating job",
      error: error.message
    });
  }
}



export const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;   
    const userId = req.userId;        

    const { proposedPrice, coverLetter } = req.body;

    //  Check if job exists
    const job = await JobModel.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    //  Prevent user from applying to their own job
    if (job.createdBy.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own job"
      });
    }

    //  Prevent duplicate application
    const alreadyApplied = await ApplicationModel.findOne({
      jobId,
      applicantId: userId
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job"
      });
    }

    //  Create application
    const application = await ApplicationModel.create({
      jobId,
      applicantId: userId,
      proposedPrice,
      coverLetter
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error applying to job",
      error: error.message
    });
  }
};


// controllers/jobController.js

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await JobModel.find()
      .populate("createdBy", "name email") 

    res.status(200).json({
      success: true,
      jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching jobs",
      error: error.message
    });
  }
};




export const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.userId;

    // 1. Check job exists
    const job = await JobModel.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // 2. Only job owner can view applications
    if (job.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    // 3. Get applications
    const applications = await ApplicationModel.find({ jobId })
      .populate("applicantId", "name email skills");

    res.json({
      success: true,
      applications
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateApplicationStatus = async (req, res) => {
  try {
    const { appId } = req.params;
    const { status } = req.body; // "accepted" or "rejected"
    const userId = req.userId;

    const application = await ApplicationModel.findById(appId).populate("jobId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only job owner can update
    if (application.jobId.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    // Optional: update job status if accepted
    if (status === "accepted") {
      application.jobId.status = "in_progress";
      await application.jobId.save();
    }

    res.json({
      success: true,
      message: "Application updated",
      application
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyApplications = async (req, res) => {
  try {
    const userId = req.userId;

    const applications = await ApplicationModel.find({
      applicantId: userId
    })
      .populate("jobId", "title budget status");

    res.json({
      success: true,
      applications
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyPostedJobs = async (req, res) => {
  try {
    const userId = req.userId; // Provided by your userAuth middleware
    const jobs = await JobModel.find({ createdBy: userId });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};