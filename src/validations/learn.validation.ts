import { z } from "zod";
import { LEARN_STATUS } from "../constants";

export const learnQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export const createLearnSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.string().optional(),
  videoUrl: z.string().optional(),
  status: z
    .enum([LEARN_STATUS.DRAFT, LEARN_STATUS.PUBLISHED])
    .optional()
    .default(LEARN_STATUS.DRAFT),
});

export const updateLearnSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  slug: z.string().min(1, "Slug is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  thumbnail: z.string().optional(),
  videoUrl: z.string().optional(),
  status: z.enum([LEARN_STATUS.DRAFT, LEARN_STATUS.PUBLISHED]).optional(),
});
