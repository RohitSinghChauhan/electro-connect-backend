import { searchNearbyShops } from "../services/googlePlaces.service";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { nearbyShopsQuerySchema } from "../validations/shop.validation";

export const getNearbyShopsController = asyncHandler(async (req, res) => {
  const { lat, lng, radius } = nearbyShopsQuerySchema.parse(req.query);

  const shops = await searchNearbyShops({
    latitude: lat,
    longitude: lng,
    radius,
  });

  res.status(200).json(
    new ApiResponse(200, "Data fetched successfully", shops, {
      count: shops.length,
    })
  );
});