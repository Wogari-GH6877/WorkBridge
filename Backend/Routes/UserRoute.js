import express from "express"
import { SignUp } from "../Controllers/UserController.js";

const userRoutes=express.Router();

userRoutes.post("/sign-up",SignUp);

export default userRoutes;