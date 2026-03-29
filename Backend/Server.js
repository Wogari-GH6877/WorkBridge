import express from "express";
import "dotenv/config";
import cors from "cors";
import DBConnection from "./Config/MongoDb.js";
import userRoutes from "./Routes/UserRoute.js";

const app=express();
const Port=process.env.PORT || 5000;



// Db Connection
DBConnection();

//middle wares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://localhost:5177","http://localhost:5174","http://localhost:5173",
        process.env.CLIENT_URL1,process.env.ADMIN_URL1,
    process.env.CLIENT_URL2,process.env.ADMIN_URL2],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.get("/",(req,res)=>{
    res.send("Apis is Working ");
})


//Routes
app.use("/api/user",userRoutes);
app.listen(Port,()=>{
    console.log(`Server is Listenig at Port ${Port}`)
})