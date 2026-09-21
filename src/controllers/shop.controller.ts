import { Request, Response } from "express";

import { searchNearbyShops } from "../services/googlePlaces.service";
import {
  createShop,
  deleteShop,
  getMyShops,
  getNearbyShops,
  getOverviewStats,
  updateShop,
} from "../services/shop.service";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import {
  createShopSchema,
  nearbyShopsQuerySchema,
  shopIdParamsSchema,
  shopQuerySchema,
  updateShopSchema,
} from "../validations/shop.validation";

export const createShopController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      name,
      description,
      phone,
      email,
      address,
      latitude,
      longitude,
      services,
    } = createShopSchema.parse(req.body);

    const result = await createShop({
      ownerId: req.user!.userId,
      name,
      description,
      phone,
      email,
      address,
      latitude,
      longitude,
      services,
    });

    res
      .status(201)
      .json(new ApiResponse(201, "Shop submitted successfully", result));
  },
);

export const getMyShopsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = shopQuerySchema.parse(req.query);

    const result = await getMyShops({
      ownerId: req.user!.userId,
      page,
      limit,
    });

    res.status(200).json(
      new ApiResponse(200, "Shops fetched successfully", result.items, {
        count: result.items.length,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      }),
    );
  },
);

export const updateShopController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = shopIdParamsSchema.parse(req.params);
    const body = updateShopSchema.parse(req.body);

    const shop = await updateShop(id, body, {
      userId: req.user!.userId,
      role: req.user!.role,
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Shop updated successfully", shop));
  },
);

export const deleteShopController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = shopIdParamsSchema.parse(req.params);

    await deleteShop(id, {
      userId: req.user!.userId,
      role: req.user!.role,
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Shop deleted successfully", null));
  },
);

export const getOverviewStatsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const stats = await getOverviewStats({
      userId: req.user!.userId,
      role: req.user!.role,
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Overview stats fetched successfully", stats));
  },
);

export const getNearbyShopsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { lat, lng, radius, page, limit } = nearbyShopsQuerySchema.parse(req.query);

    const result = await getNearbyShops({
      latitude: lat,
      longitude: lng,
      radius,
      page,
      limit,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        "Data fetched successfully",
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

export const getNearbyGoogleShopsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { lat, lng, radius } = nearbyShopsQuerySchema.parse(req.query);

    const shops = await searchNearbyShops({
      latitude: lat,
      longitude: lng,
      radius,
    });

    res.status(200).json(
      new ApiResponse(200, "Data fetched successfully", shops, {
        count: shops.length,
      }),
    );
  },
);
