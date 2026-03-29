import express from "express"
import { createJob, Login, SignUp ,applyToJob,getAllJobs,getJobApplications,updateApplicationStatus,getMyApplications,
    getMyPostedJobs
} from "../Controllers/UserController.js";
import { loginLimiter, signupLimiter } from "../Middleware/RateLimiter.js";
import userAuth from "../Middleware/userAuth.js";

const userRoutes=express.Router();

userRoutes.post("/sign-up",signupLimiter,SignUp);
userRoutes.post("/login",loginLimiter,Login);
userRoutes.post("/post-job",userAuth,createJob);
userRoutes.post("/jobs/:jobId/apply", userAuth, applyToJob);
userRoutes.get("/jobs", getAllJobs);
userRoutes.get("/jobs/:jobId/applications", userAuth, getJobApplications);
userRoutes.patch("/applications/:appId/status", userAuth, updateApplicationStatus);
userRoutes.get("/jobs/my-applications", userAuth, getMyApplications);
userRoutes.get("/my-posted-jobs", userAuth, getMyPostedJobs);
export default userRoutes;