import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserModel } from "../models/user.model.js";
dotenv.config();
export const verifyJWT = async (req, res, next) => {
  try {
    //Cookies only found in browser so for mobile application header use

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    //if token not found throw error
    if (!token) {
      return res
        .status(401)
        .json({ status: 401, error: "Unauthorized request" });
    }

    // if found then decode it to get id
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    let user = "";

    user = await UserModel.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({ status: 401, error: "Invalid Token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, error: "Invalid Access Token" });
  }
};
