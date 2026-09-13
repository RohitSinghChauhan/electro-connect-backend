import { Document, Types } from "mongoose";

export interface IApplication extends Document {
  job: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
}

export interface CreateApplicationInput {
  jobId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}
