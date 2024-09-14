import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

const addBlog = async (req, res) => {
  try {
    console.log(req.user);
    const data = JSON.parse(req.body.data);
    const blogImage = req.files?.blogImage?.tempFilePath;
    if (!blogImage) throw new ApiError(400, "Avatar image is required");
    const blogImg = await uploadOnCloudinary(blogImage, "blog-image");
    const userForDeleteImage = await User.findOne(req.user?._id);
    if (userForDeleteImage.imagePath) {
      await cloudinary.uploader.destroy(userForDeleteImage.imagePath);
    }
    if (!blogImg?.url)
      throw new ApiError(400, "Error while uploading image. try again");
    const formData = {
      ...data,
      author: req.user._id,
      blogImage: blogImg.url,
      imagePath: blogImg.public_id,
    };
    const blog = new Blog(formData);
    await blog.save();
    return res
      .status(200)
      .json(new ApiResponse(201, {}, "blog post successfully"));
  } catch (error) {
    return res
      .status(error?.statusCode)
      .json(new ApiResponse(error?.statusCode, {}, error.message));
  }
};

const getBlogs = async (req, res) => {
  const blogs = await Blog.find().populate("author");
  return res
    .status(200)
    .json(new ApiResponse(200, blogs, "Blogs fetched successfully"));
};

const deleteBlog = async (req, res) => {
  const blogId = req.params.id;
  await Blog.findByIdAndDelete(blogId);
  return res.status(200).json(new ApiResponse(200, {}, "blog deleted"));
};

export { addBlog, getBlogs, deleteBlog };
