import mongoose from "mongoose";

const FiltreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    linkedin: { type: String },
    education: { type: String },
    skills: { type: String },
    experience: { type: String, required: true },
    resumeLink: { type: String, required: true },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job-descriptions",
    },
  },

  { timestamps: true }
);
export const FiltreResumeModel = mongoose.model("filtre-resumes", FiltreSchema);
