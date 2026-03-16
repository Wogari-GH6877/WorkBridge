import mongoose from "mongoose";


const JobSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        maxlenght:100,
        trim:true },
    
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },

    budget: {
        type: Number,
        required: true,
        min: 0
    },

    skillsRequired: [{
        type: String
    }],

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,

    },

    status: {
    type: String,
    enum: ["open", "in_progress", "completed", "closed"],
    default: "open"
  },

  deadline: {
    type: Date
  }


},{
    timestamps:true
})

const JobModel=mongoose.models.jobs || mongoose.model("Jobs",JobSchema);

export default JobModel;