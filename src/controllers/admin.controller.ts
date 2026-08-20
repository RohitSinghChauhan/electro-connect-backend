import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import {
  approveShop,
  getPendingShops,
  rejectShop,
} from "../services/admin.service";

export const getPendingShopsController = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const shops = await getPendingShops();

    res
      .status(200)
      .json(new ApiResponse(200, "Pending shops fetched successfully", shops));
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
