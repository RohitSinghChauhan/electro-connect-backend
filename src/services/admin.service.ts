import { SHOP_STATUS } from "../constants";
import Shop from "../models/shop.model";
import { ApiError } from "../utils/api-error";

export const getPendingShops = async () => {
  const shops = await Shop.find({
    status: SHOP_STATUS.PENDING,
  })
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  return shops;
};

export const approveShop = async (shopId: string) => {
  const shop = await Shop.findById(shopId);

  if (!shop) {
    throw new ApiError(404, "Shop not found");
  }

  if (shop.status !== SHOP_STATUS.PENDING) {
    throw new ApiError(
      400,
      "Only pending shops can be approved"
    );
  }

  shop.status = SHOP_STATUS.APPROVED;

  await shop.save();

  return shop;
};

export const rejectShop = async (shopId: string) => {
  const shop = await Shop.findById(shopId);

  if (!shop) {
    throw new ApiError(404, "Shop not found");
  }

  if (shop.status !== SHOP_STATUS.PENDING) {
    throw new ApiError(
      400,
      "Only pending shops can be rejected"
    );
  }

  shop.status = SHOP_STATUS.REJECTED;

  await shop.save();

  return shop;
};