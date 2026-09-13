import { Document, Types } from "mongoose";

export type JobStatus = "open" | "closed";

export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "freelance";

export interface IJob extends Document {
  title: string;
  description?: string;
  businessName: string;
  phoneNumber: string;
  serviceType: string;
  location: string;
  employmentType: EmploymentType;
  jobStatus: JobStatus;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobInput {
  title: string;
  description?: string;
  businessName: string;
  phoneNumber: string;
  serviceType: string;
  location: string;
  employmentType: EmploymentType;
  createdBy: string;
}

export interface UpdateJobInput {
  title?: string;
  description?: string;
  businessName?: string;
  phoneNumber?: string;
  serviceType?: string;
  location?: string;
  employmentType?: EmploymentType;
  jobStatus?: JobStatus;
}

export interface ApplyJobInput {
  name: string;
  email: string;
  phone: string;
  message: string;
}
