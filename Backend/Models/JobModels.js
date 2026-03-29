import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100, // Fixed typo: 'maxlenght' -> 'maxlength'
    trim: true 
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000 // Increased to allow for long "Key Responsibilities"
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  worktime: {
    type: String,
    required: true,
    enum: ["Full-time", "Part-time", "Contract", "Remote", "Freelance"], // Added enum for consistency
    default: "Full-time"
  },
  location: { // Added for the UI "Lagos (On-site)"
    type: String,
    required: true,
    default: "Remote"
  },
  experienceLevel: { // Added for the UI "5years"
    type: String,
    default: "Intermediate"
  },
  applicantsCount: { // Fixed typo: 'numberPalicante' -> 'applicantsCount'
    type: Number,
    default: 0
  },
  skillsRequired: [{
    type: String
  }],

  responsibilities: [{ type: String }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  applicantsCount: {
  type: Number,
  default: 0 // This ensures every new job starts at 0
    },
  status: {
    type: String,
    enum: ["open", "in_progress", "completed", "closed"],
    default: "open"
  },
  deadline: {
    type: Date
  }
}, {
  timestamps: true
});

const JobModel = mongoose.models.Job || mongoose.model("Job", JobSchema);

export default JobModel;