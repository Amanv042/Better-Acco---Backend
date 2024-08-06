import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
    },
    review: { type: String, require: true },
    rating: { type: Number, require: true },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
