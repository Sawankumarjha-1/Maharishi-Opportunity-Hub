import express from "express";
import dotenv from "dotenv";
import { DBConnection } from "./db/index.js";
import { upload } from "./middlewares/multer.middleware.js";
import { FiltreResumeModel } from "./models/filtre-resume.model.js";
import { PdfDataParser } from "pdf-data-parser";
import { generateAccessAndRefereshTokens } from "./helper/index.helper.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { uploadOnCloudinary } from "./helper/cloudinary.helper.js";
import fs from "fs";

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
import {
  checkRequiredHeadings,
  hasEmail,
  hasPhoneno,
  hasRequiredEducation,
  hasSkills,
  isResume,
} from "./helper/check.helper.js";

dotenv.config();
DBConnection();

const app = express();
const PORT = process.env.PORT;
const defaultRoute = "/api/v1/portal";
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
//you need to use multer too it is not enough now
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// it means that server is accepting json data
app.use(express.static("public"));
app.use(cookieParser());
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
      return res.status(401).json({ error: "All Fields are required !" });
    }

    if (password.length < 5) {
      return res
        .status(401)
        .json({ error: "Password must be at least 5 character!" });
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
//Fetching other Job Post
app.get(`${defaultRoute}/other-user`, verifyJWT, async (req, res) => {
  try {
    const data = await UserModel.find({ _id: { $ne: req.user._id } });
    res.status(200).json({ status: 200, message: "success", data: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
//*******************************Delete Particular User*******************/
app.get(
  `${defaultRoute}/delete/particular-user/:id`,
  verifyJWT,
  async (req, res) => {
    try {
      const { id } = req.params;
      await UserModel.findOneAndDelete({ _id: id });
      res.status(200).json({ status: 200, message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
/********************************Update Password**************************/
app.post(
  `${defaultRoute}/update/password`,
  upload.none(),
  verifyJWT,
  async (req, res) => {
    try {
      const id = req.user._id;
      //Getting the value of all required fields
      const { password, newPassword, confirmPassword } = req.body;
      //Convert it into array tovalidate all fields
      const requiredFields = [password, newPassword, confirmPassword];

      const allFieldsValid = requiredFields.every(
        (field) => field && field.trim() !== ""
      );
      if (!allFieldsValid) {
        return res
          .status(401)
          .json({ status: 401, error: "All Fields are required !" });
      }

      const user = await UserModel.findById(id);

      if (!user) {
        return res
          .status(401)
          .json({ status: 401, error: "Invalid Credential" });
      }

      const verifyPassword = await user.isPasswordCorrect(password);
      if (!verifyPassword) {
        return res.status(401).json({
          status: 401,
          error: "Incorrect password!",
        });
      }

      if (newPassword != confirmPassword) {
        return res.status(401).json({
          status: 401,
          error: "New Password and Confirm password does not match",
        });
      }
      if (newPassword.length < 5) {
        return res
          .status(401)
          .json({ error: "Password must be at least 5 character!" });
      }
      user.password = newPassword;
      user.save({ validateBeforeSave: false });
      return res.status(200).json({ status: 200, message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
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
/********************************Logout user******************************/
app.get(`${defaultRoute}/logout`, verifyJWT, async (req, res) => {
  //req.user set by Auth Middleware
  await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  //In logout we clear cookie
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ status: 200, message: "success" });
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
/********************************Update Job Post*************************/
app.post(
  `${defaultRoute}/update/job-listing/:id`,
  upload.none(),
  async (req, res) => {
    try {
      const { id } = req.params;
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
        status,
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
        status,
      ];

      const allFieldsValid = requiredFields.every(
        (field) => field && field.trim() !== ""
      );

      if (!allFieldsValid) {
        res.status(401).json({ error: "All Fields are required !" });
      }

      //Creating Document int job description model
      const jData = {
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
        status,
      };
      await JobDescriptionModel.findOneAndUpdate(
        { _id: id },

        jData, // Update: Data to be inserted or updated
        { upsert: true, new: true, setDefaultOnInsert: true } // Options: Upsert and return new document
      );
      res.status(200).json({ status: 200, message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
/*******************************Delete Job post***************************/
app.get(
  `${defaultRoute}/delete/job-listing/:id`,
  verifyJWT,
  async (req, res) => {
    try {
      const { id } = req.params;
      await JobDescriptionModel.findOneAndDelete({ _id: id });
      res.status(200).json({ status: 200, message: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
/****************************Post Candidate Route*************************/
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

      if (!isResume(actualData)) {
        return res.status(401).json({ status: 401, error: "Not Resume PDF !" });
      }

      const jobData = await JobDescriptionModel.findById(jobId);

      if (!jobData) {
        return res.status(401).json({ error: "Job Post does not exits!" });
      }

      if (parseInt(experience) < jobData.experience) {
        fs.unlinkSync(fdata.path);
        return res
          .status(200)
          .json({ status: 200, success: true, message: "success" });
      }
      if (!hasRequiredEducation(actualData, jobData.minimumEducation)) {
        fs.unlinkSync(fdata.path);
        return res
          .status(200)
          .json({ status: 200, success: true, message: "success" });
      }
      if (!hasSkills(actualData, jobData.skills)) {
        fs.unlinkSync(fdata.path);
        return res
          .status(200)
          .json({ status: 200, success: true, message: "success" });
      }
      if (!hasEmail(actualData)) {
        fs.unlinkSync(fdata.path);
        return res
          .status(200)
          .json({ status: 200, success: true, message: "success" });
      }

      if (!hasPhoneno(actualData)) {
        fs.unlinkSync(fdata.path);
        return res
          .status(200)
          .json({ status: 200, success: true, message: "success" });
      }

      if (!checkRequiredHeadings(actualData)) {
        fs.unlinkSync(fdata.path);
        return res
          .status(200)
          .json({ status: 200, success: true, message: "success" });
      }

      /********************upload Resume on cloudinary**************** */
      const { file } = req;
      if (!file?.path) {
        return res
          .status(401)
          .json({ status: 401, error: "Please upload resume!" });
      }
      const imagLink = await uploadOnCloudinary(file.path);
      if (!imagLink) {
        return res
          .status(401)
          .json({ status: 401, error: "Please upload resume!" });
      }

      const resumeData = {
        name: name,
        email: email,
        phone: extractPhone(actualData),
        education: extractEducation(actualData).join(" | "),
        linkedin: extractLinkedInLinks(actualData),
        skills: extractSkills(actualData).join(" | "),
        resumeLink: imagLink.url,
        experience: experience,
        jobId,
      };

      await FiltreResumeModel.findOneAndUpdate(
        { email: email, jobId: jobId },

        resumeData, // Update: Data to be inserted or updated
        { upsert: true, new: true, setDefaultOnInsert: true } // Options: Upsert and return new document
      );

      return res
        .status(200)
        .json({ status: 200, success: true, message: "success" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);
//**************************Fetching All Job Post************************
app.get(`${defaultRoute}/job-data`, async (req, res) => {
  try {
    const data = await JobDescriptionModel.find();
    res.status(200).json({ status: 200, message: "success", data: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
//**************************Fetching Individual Job Post*****************
app.get(`${defaultRoute}/job-data/:jobId`, async (req, res) => {
  try {
    const { jobId } = req.params;
    if (!isValidObjectId(jobId)) {
      return res.status(401).json({ error: "invalid job id" });
    }
    const data = await JobDescriptionModel.findById(jobId);
    return res
      .status(200)
      .json({ status: 200, message: "success", data: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
/**********************Getting Account Info******************************/
app.get(`${defaultRoute}/account-info`, verifyJWT, async (req, res) => {
  try {
    const data = await UserModel.find({ _id: req.user._id }).select(
      "-accessToken -refreshToken"
    );
    return res
      .status(200)
      .json({ status: 200, message: "success", data: data[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**********************Getting All Candidate Per Job Posts***************/
app.get(`${defaultRoute}/candidates/for-all-post`, async (req, res) => {
  try {
    //Aggregrate Pipelining
    const result = await JobDescriptionModel.aggregate([
      {
        $lookup: {
          from: "filtre-resumes", // Collection name of the User model
          localField: "_id",
          foreignField: "jobId",
          as: "candidates",
        },
      },
      {
        //For Getting particular Field
        $project: {
          title: 1,
          company: 1,
          experience: 1,
          skills: 1,
          salary: 1,
          status: 1,
          postedDate: 1,
          location: 1,
          "candidates._id": 1,
          "candidates.name": 1,
          "candidates.email": 1,
          "candidates.phone": 1,
          "candidates.linkedin": 1,
          "candidates.education": 1,
          "candidates.experience": 1,
          "candidates.resumeLink": 1,
          "candidates.jobId": 1,
        },
        // $unwind: "$candidates", // Deconstructs the array field from $lookup
      },
    ]);

    return res
      .status(200)
      .json({ status: 200, message: "success", data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
/**********************Getting all candidates from particular jobs */
app.get(
  `${defaultRoute}/candidates/for-particular-post/:id`,
  async (req, res) => {
    try {
      const id = req.params.id;
      if (!isValidObjectId(id)) {
        return res.status(401).json({ status: 401, error: "Invalid Id" });
      }
      const result = await FiltreResumeModel.find({ jobId: id });
      return res
        .status(200)
        .json({ status: 200, message: "success", data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);
/*********************Particular candidate data******************** */
app.get(`${defaultRoute}/particular-candidate/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(401).json({ status: 401, error: "Invalid Id" });
    }
    const data = await FiltreResumeModel.findById({ _id: id });
    return res
      .status(200)
      .json({ status: 200, message: "success", data: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**********************Delete particular candidates from particular jobs */
app.get(`${defaultRoute}/delete-candidate/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(401).json({ status: 401, error: "Invalid Id" });
    }
    await FiltreResumeModel.findOneAndDelete({ _id: id });
    return res.status(200).json({ status: 200, message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/* Listening at particular port number*/
app.listen(PORT, () => {
  console.log("Hey , I am listening at port no : " + PORT);
});
