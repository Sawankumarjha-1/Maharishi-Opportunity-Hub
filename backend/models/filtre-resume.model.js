import mongoose from "mongoose";

const FiltreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    linkedin: { type: String },
    education: { type: String },
    skills: { type: String },
    workAt: { type: String },
    experience: { type: String, required: true },
    dob: { type: String },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job-descriptios",
    },
  },

  { timestamps: true }
);
export const FiltreResumeModel = mongoose.model("filtre-resumes", FiltreSchema);
