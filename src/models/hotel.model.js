import mongoose, { Schema } from "mongoose";

const hotelSchema = new Schema(
  {
    name: { type: String, require: [true, "Hotel Name is requireds"] },
    price: { type: String, require: [true, "Price is required"] },

    roomType: { type: String, require: [true, "Room type is required"] },
    propertySize: { type: String, default: "N/A" },

    description: { type: String, require: [true, "Description is required"] },
    images: [{ imageURI: { type: String }, imageLoc: { type: String } }],
    address: {
      landmark: { type: String, requires: true },
      street: { type: String, require: true },
      city: { type: String, require: true },
      state: { type: String, require: trues },
      country: { type: String, require: trues },
      postalCode: { type: String, require: trues },
    },
    duration: {
      from: { type: String, require: true },
      to: { type: String, require: true },
    },

    rating: { type: Number, default: 0 },

    includedBills: [
      {
        name: { type: String },
        isAvailable: { type: Boolean, default: false },
      },
    ],

    freebies: [
      {
        name: { type: String },
        isAvailable: { type: Boolean, default: false },
      },
    ],

    amenities: [
      {
        name: { type: String },
        isAvailable: { type: Boolean, default: false },
      },
    ],

    rooms: {
      common: {
        amenities: [
          {
            name: { type: String },
            isAvailable: { type: Boolean, default: false },
          },
        ],
        description: { type: String, require: true },
      },
      premium: {
        amenities: [
          {
            name: { type: String },
            isAvailable: { type: Boolean, default: false },
          },
        ],
        description: { type: String, require: true },
      },
      deluxe: {
        amenities: [
          {
            name: { type: String },
            isAvailable: { type: Boolean, default: false },
          },
        ],
        description: { type: String, require: true },
      },
    },
  },
  { timestamps: true }
);

export const Hotel = mongoose.model("Hotel", hotelSchema);
