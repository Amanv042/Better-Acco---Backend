import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { User } from "../models/user.model.js";

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
  // const { data } = req.body;
  // const formData = JSON.parse(data);
  // const { fullname, username, email, password } = formData;
  const { fullname, username, email, password } = req.body;

  // Checking if any field is empty
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  )
    throw new ApiError(400, "All field are required");

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) throw new ApiError(409, "User already registered");

  // const user = new User(formData);
  const user = new User(req.body);
  await user.save();
  const createdUser = await User.findOne(user._id).select("-password");

  if (!createdUser)
    throw new ApiError(500, "something went wrong while creating user");

  return res
    .status(200)
    .json(new ApiResponse(201, createdUser, "user created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(email || username))
    throw new ApiError(400, "username or email is required");

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) throw new ApiError(404, "user does not exist");
  const validUser = await user.isPasswordCorrect(password);
  if (!validUser) throw new ApiError(401, "Invalid user credentails");

  const accessToken = user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .setHeader("Autherization", `Bearer ${accessToken}`)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (_, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logout successfully"));
});

const changePassword = asyncHandler(async (req, res) => {});

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

const updateAccountDetails = asyncHandler(async (req, res) => {
  const data = req.body;
  await User.findByIdAndUpdate(
    req.user._id,
    data,
    {
      $set: { ...data },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Account updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.avatar?.tempFilePath;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar image is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar?.url)
    throw new ApiError(400, "Error while uploading image. try again");

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Avatar update successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateAccountDetails,
  updateAvatar,
};
