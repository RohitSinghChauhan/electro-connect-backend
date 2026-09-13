import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import {
  approveShop,
  getPendingShops,
  rejectShop,
} from "../services/admin.service";
import { pendingShopsQuerySchema } from "../validations/admin.validation";

export const getPendingShopsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { page, limit } =
      pendingShopsQuerySchema.parse(req.query);

    const result = await getPendingShops({
      page,
      limit,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        "Pending shops fetched successfully",
        result.shops,
        {
          count: result.shops.length,
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      ),
    );
  },
);

export const approveShopController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const shop = await approveShop(id as string);

    res
      .status(200)
      .json(new ApiResponse(200, "Shop approved successfully", shop));
  },
);

export const rejectShopController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const shop = await rejectShop(id as string);

    res
      .status(200)
      .json(new ApiResponse(200, "Shop rejected successfully", shop));
  },
);
