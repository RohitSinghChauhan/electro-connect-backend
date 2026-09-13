import mongoose, { Schema } from "mongoose";

import { ILearn } from "../types/learn.types";
import { LEARN_STATUS } from "../constants";

const learnSchema = new Schema<ILearn>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    content: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      trim: true,
    },

    videoUrl: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [LEARN_STATUS.DRAFT, LEARN_STATUS.PUBLISHED],
      default: LEARN_STATUS.DRAFT,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Learn = mongoose.model<ILearn>("Learn", learnSchema);

export default Learn;
