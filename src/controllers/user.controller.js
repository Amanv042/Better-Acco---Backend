import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { User } from "../models/user.model.js";

import { WEBSITE_DOMAIN } from "../constant.js";

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: true,
};

const registerUser = async (req, res) => {
  const { data } = req.body;
  const formData = JSON.parse(data);
  const { fullname, username, email, phone, password } = formData;

  // Checking if any field is empty
  try {
    if (
      [fullname, username, email, phone, password].some(
        (field) => field?.trim() === ""
      )
    )
      throw new ApiError(400, "Please fill all fields");

    if (password.length <= 7)
      throw new ApiError(400, "password must be of 8 characters");

    const existedUser = await User.findOne({
      $or: [{ username }, { email }, { phone }],
    });

    if (existedUser) throw new ApiError(409, "User already exist");

    // const user = new User(formData);
    const user = new User(formData);
    await user.save();
    const createdUser = await User.findOne(user._id).select("-password");

    if (!createdUser)
      throw new ApiError(500, "something went wrong while creating user");

    return res
      .status(200)
      .json(new ApiResponse(201, createdUser, "User Registered"));
  } catch (error) {
    return res
      .status(error?.statusCode)
      .json(new ApiResponse(error?.statusCode, {}, error.message));
  }
};

const loginUser = async (req, res) => {
  const { data } = req.body;
  const formData = JSON.parse(data);
  const { login_id, password } = formData;
  // const { email, username, password } = req.body;

  try {
    if (!login_id) throw new ApiError(400, "username or email is required");

    const user = await User.findOne({
      $or: [{ username: login_id }, { email: login_id }],
    });

    if (!user) throw new ApiError(404, "user does not exist");
    const validUser = await user.isPasswordCorrect(password);

    if (!validUser) throw new ApiError(401, "Invalid user credentails");

    const accessToken = user.generateAccessToken();

    const loggedInUser = await User.findById(user._id).select("-password");

    return res
      .status(200)
      .setHeader("Autherization", `Bearer ${accessToken}`)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken },
          "Login complete"
        )
      );
  } catch (error) {
    return res
      .status(error?.statusCode)
      .json(new ApiResponse(error?.statusCode, {}, error.message));
  }
};

const logoutUser = asyncHandler(async (_, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logout successfully"));
});

const sendMailForChangePasswordWhenUserAuthenticated = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    const mailOptions = {
      from: "pubgm7309@gmail.com",
      to: req.user.email,
      subject: "Change Password",
      html: `<a href="${WEBSITE_DOMAIN}/change-password" >Click here to change password</a>`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) console.log(err);
    });

    return res.status(200).json(new ApiResponse(200, {}, "Check your gmail"));
  }
);

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const isPasswordCurrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCurrect) throw new ApiError(400, "Old Password is wrong");

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password Change Successfully"));
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, {}, error.message));
  }
};

const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        `Current user fetched. user fullname ${user?.fullname}`
      )
    );
});

const updateAccountDetails = async (req, res) => {
  const { data } = req.body;
  const formData = JSON.parse(data);
  try {
    await User.findByIdAndUpdate(req.user?._id, { ...formData }, { new: true });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Account updated successfully"));
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, {}, error.message));
  }
};

const updateAvatar = asyncHandler(async (req, res) => {
  try {
    const avatarLocalPath = req.files?.avatar?.tempFilePath;

    if (!avatarLocalPath) throw new ApiError(400, "Avatar image is required");

    const avatar = await uploadOnCloudinary(avatarLocalPath, "user-avatar");

    const userForDeleteImage = await User.findOne(req.user?._id);

    if (userForDeleteImage.imagePath) {
      await cloudinary.uploader.destroy(userForDeleteImage.imagePath);
    }

    if (!avatar?.url)
      throw new ApiError(400, "Error while uploading image. try again");

    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { avatar: avatar.url, imagePath: avatar.public_id },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Avatar update successfully"));
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, {}, error.message));
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  sendMailForChangePasswordWhenUserAuthenticated,
  changePassword,
  currentUser,
  updateAccountDetails,
  updateAvatar,
};
