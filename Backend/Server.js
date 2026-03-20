import express from "express";
import "dotenv/config";
// import cors from "cors";
import DBConnection from "./Config/MongoDb.js";
import userRoutes from "./Routes/UserRoute.js";

const app=express();
const Port=process.env.PORT || 5000;



// Db Connection
DBConnection();

//middle wares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.send("Apis is Working ");
})


//Routes
app.use("/api/user",userRoutes);
app.listen(Port,()=>{
    console.log(`Server is Listenig at Port ${Port}`)
})