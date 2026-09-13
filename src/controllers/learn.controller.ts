import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import {
  createLearn,
  deleteLearn,
  getAdminLearnDetails,
  getAdminLearnList,
  getPublishedLearnDetails,
  getPublistedLearnList,
  updateLearn,
} from "../services/learn.service";
import {
  createLearnSchema,
  learnQuerySchema,
  updateLearnSchema,
} from "../validations/learn.validation";

export const getPublishedLearnListController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = learnQuerySchema.parse(req.query);

    const result = await getPublistedLearnList({ page, limit });

    res.status(200).json(
      new ApiResponse(200, "Data fetched successfully", result.items, {
        count: result.items.length,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      }),
    );
  },
);

export const getPublishedLearnDetailsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const item = await getPublishedLearnDetails(id as string);

    res
      .status(200)
      .json(new ApiResponse(200, "Data fetched successfully", item));
  },
);

// Admin routes
export const createLearnController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const body = createLearnSchema.parse(req.body);

    const item = await createLearn({
      ...body,
      createdBy: req.user!.userId,
    });

    res
      .status(201)
      .json(new ApiResponse(201, "Learn content created successfully", item));
  },
);

export const getAdminLearnController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = learnQuerySchema.parse(req.query);

    const result = await getAdminLearnList({ page, limit });

    res.status(200).json(
      new ApiResponse(200, "Learn content fetched successfully", result.items, {
        count: result.items.length,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      }),
    );
  },
);

export const getAdminLearnByIdController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const item = await getAdminLearnDetails(id as string);

    res
      .status(200)
      .json(new ApiResponse(200, "Learn content fetched successfully", item));
  },
);

export const updateLearnController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const body = updateLearnSchema.parse(req.body);

    const item = await updateLearn(id as string, body);

    res
      .status(200)
      .json(new ApiResponse(200, "Learn content updated successfully", item));
  },
);

export const deleteLearnController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    await deleteLearn(id as string);

    res
      .status(200)
      .json(new ApiResponse(200, "Learn content deleted successfully", null));
  },
);
