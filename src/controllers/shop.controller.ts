import { searchNearbyShops } from "../services/googlePlaces.service";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { nearbyShopsQuerySchema } from "../validations/shop.validation";
import { createShop } from "../services/shop.service";
import { Request, Response } from "express";

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
    } = req.body;

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

export const getNearbyShopsController = asyncHandler(
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
