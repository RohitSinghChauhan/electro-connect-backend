import mongoose, { Schema } from "mongoose";

import { IShop } from "../types/shop.types";

const shopSchema = new Schema<IShop>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },

    services: {
      type: [String],
      default: [],
    },

    status: {
        type: Number,
        enum: [-1, 0, 1],
        default: 0
    },
  },
  {
    timestamps: true,
  }
);

shopSchema.index({
  location: "2dsphere",
});

const Shop = mongoose.model<IShop>("Shop", shopSchema);

export default Shop;