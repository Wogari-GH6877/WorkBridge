import mongoose from "mongoose";


const ApplicationSchema=new mongoose.Schema({
    jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  coverLetter: {
    type: String,
    maxlength: 1000
  },

  proposedPrice: {
    type: Number,
    required: true,
    min: 0
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }

}
,{
    timestamps:true
});

ApplicationSchema.index(
  { jobId: 1, applicantId: 1 },
  { unique: true }
);

const ApplicationModel=mongoose.models.Applications || mongoose.model("Applications",ApplicationSchema);

export default ApplicationModel;