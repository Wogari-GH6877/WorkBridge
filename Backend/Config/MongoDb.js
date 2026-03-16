import mongoose from "mongoose";

const DBConnection=async ()=>{

    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error("[Error] : DB Connection is Failed: ", error.message);
        process.exit(1);
        
    }

    mongoose.connection.on("connected",()=>{
        console.log("DB Connected Successfully");
    })

    mongoose.connection.on("error",(err)=>{
        console.error("[Error : ] MongoDB Run Time Error:",err.message);
    })

    mongoose.connection.on("disconnected",()=>{
        console.log("[Warn] : Mongodb disconnected");
    })
}

export default DBConnection;