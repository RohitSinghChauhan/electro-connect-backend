import { Request, Response } from "express";

import {
  applyForJob,
  createJob,
  deleteJob,
  getJobApplications,
  getJobById,
  getMyJobs,
  getPublicJobs,
  updateJob,
} from "../services/job.service";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import {
  applyJobSchema,
  createJobSchema,
  jobIdParamsSchema,
  jobQuerySchema,
  updateJobSchema,
} from "../validations/job.validation";

export const createJobController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const body = createJobSchema.parse(req.body);

    const job = await createJob({
      ...body,
      createdBy: req.user!.userId,
    });

    res
      .status(201)
      .json(new ApiResponse(201, "Job created successfully", job));
  }
);

export const getPublicJobsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = jobQuerySchema.parse(req.query);

    const result = await getPublicJobs({ page, limit });

    res.status(200).json(
      new ApiResponse(200, "Data fetched successfully", result.items, {
        count: result.items.length,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      })
    );
  }
);

export const getJobByIdController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const job = await getJobById(id as string);

    res
      .status(200)
      .json(new ApiResponse(200, "Job fetched successfully", job));
  }
);

export const getMyJobsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = jobQuerySchema.parse(req.query);

    const result = await getMyJobs({
      userId: req.user!.userId,
      page,
      limit,
    });

    res.status(200).json(
      new ApiResponse(200, "Jobs fetched successfully", result.items, {
        count: result.items.length,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      })
    );
  }
);

export const updateJobController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const body = updateJobSchema.parse(req.body);

    const job = await updateJob(id as string, body, {
      userId: req.user!.userId,
      role: req.user!.role,
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Job updated successfully", job));
  }
);

export const deleteJobController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    await deleteJob(id as string, {
      userId: req.user!.userId,
      role: req.user!.role,
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Job deleted successfully", null));
  }
);

export const applyForJobController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { jobId } = jobIdParamsSchema.parse(req.params);
    const body = applyJobSchema.parse(req.body);

    const application = await applyForJob(jobId, body);

    res
      .status(201)
      .json(
        new ApiResponse(201, "Application submitted successfully", application)
      );
  }
);

export const getJobApplicationsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { jobId } = jobIdParamsSchema.parse(req.params);
    const { page, limit } = jobQuerySchema.parse(req.query);

    const result = await getJobApplications({
      jobId,
      page,
      limit,
      user: {
        userId: req.user!.userId,
        role: req.user!.role,
      },
    });

    res.status(200).json(
      new ApiResponse(
        200,
        "Data fetched successfully",
        result.items,
        {
          count: result.items.length,
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        }
      )
    );
  }
);
