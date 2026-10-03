import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/auth.types";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["customer", "shopOwner", "admin"],
      default: "shopOwner",
    },
  },

  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
