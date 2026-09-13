import { z } from "zod";
import { EMPLOYMENT_TYPE, JOB_STATUS } from "../constants";

const employmentTypeEnum = z.enum([
  EMPLOYMENT_TYPE.FULL_TIME,
  EMPLOYMENT_TYPE.PART_TIME,
  EMPLOYMENT_TYPE.CONTRACT,
  EMPLOYMENT_TYPE.INTERNSHIP,
  EMPLOYMENT_TYPE.FREELANCE,
]);

const jobStatusEnum = z.enum([JOB_STATUS.OPEN, JOB_STATUS.CLOSED]);

export const jobQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export const createJobSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required").optional(),
  businessName: z.string().trim().min(1, "Business name is required"),
  phoneNumber: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 characters"),
  serviceType: z.string().trim().min(1, "Service type is required"),
  location: z.string().trim().min(1, "Location is required"),
  employmentType: employmentTypeEnum,
});

export const updateJobSchema = z.object({
  title: z.string().trim().min(1, "Title is required").optional(),
  description: z.string().trim().min(1, "Description is required").optional(),
  businessName: z.string().trim().min(1, "Business name is required").optional(),
  phoneNumber: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 characters")
    .optional(),
  serviceType: z.string().trim().min(1, "Service type is required").optional(),
  location: z.string().trim().min(1, "Location is required").optional(),
  employmentType: employmentTypeEnum.optional(),
  jobStatus: jobStatusEnum.optional(),
});

export const applyJobSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 characters"),
  message: z.string().trim().min(1, "Message is required"),
});

export const jobIdParamsSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
});
