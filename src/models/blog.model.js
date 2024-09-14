import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    blogImage: { type: String, required: true },
    imagePath: { type: String, required: true },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
