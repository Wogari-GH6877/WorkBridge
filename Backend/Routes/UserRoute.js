import express from "express"
import { Login, SignUp } from "../Controllers/UserController.js";
import { loginLimiter, signupLimiter } from "../Middleware/RateLimiter.js";

const userRoutes=express.Router();

userRoutes.post("/sign-up",signupLimiter,SignUp);
userRoutes.post("/login",loginLimiter,Login);

export default userRoutes;