import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = async (req, _, next) => {
  // this underscore at the place of res that means its not in use

  try {
    const accessToken = req.headers.autherization?.replace("Bearer", "");

    if (!accessToken) throw new ApiError(401, "Unautherized User");

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    if (!user) throw new ApiError(401, "Invalid Access Token");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invialid Access Token");
  }
};
