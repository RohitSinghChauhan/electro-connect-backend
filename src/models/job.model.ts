import mongoose, { Schema } from "mongoose";

import { EMPLOYMENT_TYPE, JOB_STATUS } from "../constants";
import { IJob } from "../types/job.types";

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    serviceType: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    employmentType: {
      type: String,
      enum: Object.values(EMPLOYMENT_TYPE),
      required: true,
    },

    jobStatus: {
      type: String,
      enum: [JOB_STATUS.OPEN, JOB_STATUS.CLOSED],
      default: JOB_STATUS.OPEN,
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

const Job = mongoose.model<IJob>("Job", jobSchema);

export default Job;
