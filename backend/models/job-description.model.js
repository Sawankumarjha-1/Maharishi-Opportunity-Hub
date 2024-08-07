import mongoose from "mongoose";

const JobDesriptionSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    aboutCompany: { type: String, required: true },
    title: { type: String, required: true },
    experience: { type: String, required: true },
    skills: { type: String, required: true },
    location: { type: String, required: true },
    minimumEducation: { type: String, required: true },
    salary: { type: String, required: true },
    joining: { type: String, required: true },
    description: { type: String, required: true },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED", "PENDING"],
      default: "OPEN",
    },
  },
  { timestamps: true }
);
export const JobDescriptionModel = mongoose.model(
  "job-descriptions",
  JobDesriptionSchema
);
