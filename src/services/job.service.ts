import { JOB_STATUS } from "../constants";
import Application from "../models/application.model";
import Job from "../models/job.model";
import {
  ApplyJobInput,
  CreateJobInput,
  UpdateJobInput,
} from "../types/job.types";
import { UserRole } from "../types/auth.types";
import { ApiError } from "../utils/api-error";

export const createJob = async (input: CreateJobInput) => {
  const job = await Job.create({
    title: input.title,
    description: input.description,
    businessName: input.businessName,
    phoneNumber: input.phoneNumber,
    serviceType: input.serviceType,
    location: input.location,
    employmentType: input.employmentType,
    jobStatus: JOB_STATUS.OPEN,
    createdBy: input.createdBy,
  });

  return job;
};

export const getPublicJobs = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;
  const filter = { jobStatus: JOB_STATUS.OPEN };

  const [items, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Job.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
};

export const getJobById = async (id: string) => {
  const job = await Job.findById(id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return job;
};

export const getMyJobs = async ({
  userId,
  page,
  limit,
}: {
  userId: string;
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;
  const filter = { createdBy: userId };

  const [items, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Job.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
};

const assertJobAccess = (
  job: { createdBy: { toString(): string } },
  user: { userId: string; role: UserRole }
) => {
  if (user.role === "admin") {
    return;
  }

  if (job.createdBy.toString() !== user.userId) {
    throw new ApiError(403, "You are not authorized to perform this action");
  }
};

export const updateJob = async (
  id: string,
  data: UpdateJobInput,
  user: { userId: string; role: UserRole }
) => {
  const job = await Job.findById(id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  assertJobAccess(job, user);

  if (data.title !== undefined) {
    job.title = data.title;
  }

  if (data.description !== undefined) {
    job.description = data.description;
  }

  if (data.businessName !== undefined) {
    job.businessName = data.businessName;
  }

  if (data.phoneNumber !== undefined) {
    job.phoneNumber = data.phoneNumber;
  }

  if (data.serviceType !== undefined) {
    job.serviceType = data.serviceType;
  }

  if (data.location !== undefined) {
    job.location = data.location;
  }

  if (data.employmentType !== undefined) {
    job.employmentType = data.employmentType;
  }

  if (data.jobStatus !== undefined) {
    job.jobStatus = data.jobStatus;
  }

  await job.save();

  return job;
};

export const deleteJob = async (
  id: string,
  user: { userId: string; role: UserRole }
) => {
  const job = await Job.findById(id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  assertJobAccess(job, user);

  await job.deleteOne();

  return job;
};

export const applyForJob = async (jobId: string, input: ApplyJobInput) => {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.jobStatus !== JOB_STATUS.OPEN) {
    throw new ApiError(
      400,
      "This job is closed and no longer accepting applications"
    );
  }

  const application = await Application.create({
    job: jobId,
    name: input.name,
    email: input.email,
    phone: input.phone,
    message: input.message,
  });

  return application;
};

export const getJobApplications = async ({
  jobId,
  page,
  limit,
  user,
}: {
  jobId: string;
  page: number;
  limit: number;
  user: { userId: string; role: UserRole };
}) => {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  assertJobAccess(job, user);

  const skip = (page - 1) * limit;
  const filter = { job: jobId };

  const [items, total] = await Promise.all([
    Application.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Application.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
};
