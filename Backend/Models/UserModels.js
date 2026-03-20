import mongoose from "mongoose"

const UserSchema=new mongoose.Schema({
    name:{
        type:String,required:true,trim:true,minlength:2,maxlength:100},
    email:{
        type:String,required:true,unique:true,lowercase:true,index:true
    },

    password:{
        type:String,required:true,minlength:8
    },
    bio:{
        type:String,maxlength:500
    },

    skills:[
        {
            type:String
        }
    ],

    imageProfile:{
        type:String
    },

    
        
    
},{
    timestamps:true
 });


 const UserModel=mongoose.models.user || mongoose.model("Users",UserSchema);

 export default UserModel;