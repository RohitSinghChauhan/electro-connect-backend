import { SHOP_STATUS } from "../constants";
import Shop from "../models/shop.model";
import { ApiError } from "../utils/api-error";

export const getPendingShops = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;

  const [shops, total] = await Promise.all([
    Shop.find({
      status: SHOP_STATUS.PENDING,
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Shop.countDocuments({
      status: SHOP_STATUS.PENDING,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    shops,
    total,
    page,
    limit,
    totalPages,
  };
};

export const getAllShops = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}) => {
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = {};

  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    filter.$or = [
      { name: searchRegex },
      { description: searchRegex },
      { phone: searchRegex },
      { email: searchRegex },
      { address: searchRegex },
      { services: searchRegex },
    ];
  }

  const [shops, total] = await Promise.all([
    Shop.find(filter)
      .populate("owner", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Shop.countDocuments(filter),
  ]);

  const items = shops.map((shop) => {
    return shop;
  });

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
};

export const approveShop = async (shopId: string) => {
  const shop = await Shop.findById(shopId);

  if (!shop) {
    throw new ApiError(404, "Shop not found");
  }

  if (shop.status !== SHOP_STATUS.PENDING) {
    throw new ApiError(400, "Only pending shops can be approved");
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
    throw new ApiError(400, "Only pending shops can be rejected");
  }

  shop.status = SHOP_STATUS.REJECTED;

  await shop.save();

  return shop;
};
