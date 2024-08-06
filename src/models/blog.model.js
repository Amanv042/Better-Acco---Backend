import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema({}, { timestamps: true });

export const Blog = mongoose.model("Blog", blogSchema);
