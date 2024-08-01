import express from "express";
import dotenv from "dotenv";
import { DBConnection } from "./db/index.js";
import { upload } from "./middlewares/multer.middleware.js";
import { FiltreResumeModel } from "./models/filtre-resume.model.js";
import { PdfDataParser } from "pdf-data-parser";
import { generateAccessAndRefereshTokens } from "./helper/index.helper.js";
import cors from "cors";

import {
  extractDOB,
  extractEducation,
  extractEmail,
  extractLinkedInLinks,
  extractName,
  extractPhone,
  extractSkills,
  extractWorkExperience,
} from "./helper/index.helper.js";
import { JobDescriptionModel } from "./models/job-description.model.js";
import { isValidObjectId } from "mongoose";
import { UserModel } from "./models/user.model.js";

dotenv.config();
DBConnection();

const app = express();
const PORT = process.env.PORT;
const defaultRoute = "/api/v1/portal";
app.use(cors());

//TODO : Verify token and allow user tonly post the job and also you need modify filtre based on job description

/********************************Create User******************************/
app.post(`${defaultRoute}/create-user`, upload.none(), async (req, res) => {
  try {
    //Getting the value of all required fields
    const { name, employeeId, designation, username, password, email } =
      req.body;
    //Convert it into array tovalidate all fields
    const requiredFields = [
      name,
      employeeId,
      designation,
      username,
      password,
      email,
    ];

    const allFieldsValid = requiredFields.every(
      (field) => field && field.trim() !== ""
    );

    if (!allFieldsValid) {
      res.status(401).json({ error: "All Fields are required !" });
    }
    const checkExisting = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    // find one return object
    if (checkExisting) {
      return res.status(401).json({
        status: 401,
        message: "User with email, username, pan or aadhar already exist !",
      });
    }

    //Creating Document int job description model
    await new UserModel({
      name,
      employeeId,
      designation,
      username,
      password,
      email,
    }).save();

    res.status(200).json({ status: 200, message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/********************************Login user*******************************/
app.post(`${defaultRoute}/login`, upload.none(), async (req, res) => {
  try {
    //Getting the value of all required fields
    const { username, password } = req.body;
    //Convert it into array tovalidate all fields
    const requiredFields = [username, password];

    const allFieldsValid = requiredFields.every(
      (field) => field && field.trim() !== ""
    );

    if (!allFieldsValid) {
      res.status(401).json({ error: "All Fields are required !" });
    }

    //Verify username and password
    const checkExistance = await UserModel.findOne({
      username: username,
    });
    //Check whether the password is correct or not
    const isCorrect = await checkExistance.isPasswordCorrect(password);
    if (!isCorrect) {
      return res.status(401).json({ status: 401, error: "invalid password" });
    }

    //get generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      checkExistance._id
    );
    //Cookies Options
    const options = {
      httpOnly: true,
      secure: true, // Must be secure other wise any one can modify
    };

    //During Login We Set Cookies
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ status: 200, message: "User logged In Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/********************************Post Job*********************************/
app.post(`${defaultRoute}/job-listing`, upload.none(), async (req, res) => {
  try {
    //Getting the value of all required fields
    const {
      company,
      aboutCompany,
      title,
      experience,
      skills,
      location,
      minimumEducation,
      salary,
      joining,
      description,
    } = req.body;
    //Convert it into array tovalidate all fields
    const requiredFields = [
      company,
      aboutCompany,
      title,
      experience,
      skills,
      location,
      minimumEducation,
      salary,
      joining,
      description,
    ];

    const allFieldsValid = requiredFields.every(
      (field) => field && field.trim() !== ""
    );

    if (!allFieldsValid) {
      res.status(401).json({ error: "All Fields are required !" });
    }

    //Creating Document int job description model
    await new JobDescriptionModel({
      company,
      aboutCompany,
      title,
      experience,
      skills,
      location,
      minimumEducation,
      salary,
      joining,
      description,
    }).save();

    res.status(200).json({ status: 200, message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/****************************Post Candidate Route*********************************/
app.post(
  `${defaultRoute}/upload-candidate/:jobId`,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const { name, experience, email } = req.body;
      const { jobId } = req.params;

      if (!isValidObjectId(jobId)) {
        return res.status(401).json({ error: "invalid job id" });
      }
      if (
        name === undefined ||
        name === null ||
        name === "" ||
        experience === undefined ||
        experience === null ||
        experience === "" ||
        email === undefined ||
        email === null ||
        email === ""
      ) {
        return res
          .status(401)
          .json({ error: "name, experience and email are also required !" });
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email)) {
        return res.status(401).json({ error: "invalid email id" });
      }

      const fdata = req.file;
      let parser = new PdfDataParser({ url: fdata.path });
      const data = await parser.parse();
      const actualData = data.toString();

      const resumeData = {
        name: name,
        email: email,
        phone: extractPhone(actualData),
        education: extractEducation(actualData).join(" | "),
        linkedin: extractLinkedInLinks(actualData),
        skills: extractSkills(actualData).join(" | "),
        workAt: extractWorkExperience(actualData).join(" | "),
        experience: experience,
        dob: extractDOB(actualData),
        jobId,
      };

      await FiltreResumeModel.findOneAndUpdate(
        { email: email, jobId: jobId },

        resumeData, // Update: Data to be inserted or updated
        { upsert: true, new: true, setDefaultOnInsert: true } // Options: Upsert and return new document
      );

      return res.json({ success: true, message: "success" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/* Listening at particular port number*/
app.listen(PORT, () => {
  console.log("Hey , I am listening at port no : " + PORT);
});
