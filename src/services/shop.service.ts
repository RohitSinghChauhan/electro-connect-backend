import mongoose from "mongoose";

import { JOB_STATUS, SHOP_STATUS } from "../constants";
import Application from "../models/application.model";
import Job from "../models/job.model";
import Shop from "../models/shop.model";
import { UserRole } from "../types/auth.types";
import {
  CreateShopInput,
  NearbyShop,
  OverviewStats,
  SearchNearbyParams,
  UpdateShopInput,
} from "../types/shop.types";
import { ApiError } from "../utils/api-error";
import { searchNearbyShops } from "./googlePlaces.service";
import { normalizeGoogleShop, normalizeManualShop } from "../helpers/shop-helpers";

export const createShop = async ({
  ownerId,
  name,
  description,
  phone,
  email,
  address,
  latitude,
  longitude,
  services,
}: CreateShopInput) => {
  const shop = await Shop.create({
    owner: ownerId,

    name,
    description,
    phone,
    email,
    address,

    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },

    services,

    status: 0,
  });

  return {
    id: shop._id.toString(),
    ownerId: ownerId.toString(),
    name: shop.name,
    description: shop.description,
    phone: shop.phone,
    email: shop.email,
    address: shop.address,
    location: shop.location,
    services: shop.services,
    status: shop.status,
    views: shop.views,
  };
};

export const getMyShops = async ({
  ownerId,
  page,
  limit,
}: {
  ownerId: string;
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;
  const filter = { owner: ownerId };

  const [items, total] = await Promise.all([
    Shop.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Shop.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
};

const assertShopAccess = (
  shop: { owner: { toString(): string } },
  user: { userId: string; role: UserRole }
) => {
  if (user.role === "admin") {
    return;
  }

  if (shop.owner.toString() !== user.userId) {
    throw new ApiError(403, "You are not authorized to perform this action");
  }
};

export const updateShop = async (
  id: string,
  data: UpdateShopInput,
  user: { userId: string; role: UserRole }
) => {
  const shop = await Shop.findById(id);

  if (!shop) {
    throw new ApiError(404, "Shop not found");
  }

  assertShopAccess(shop, user);

  if (data.name !== undefined) {
    shop.name = data.name;
  }

  if (data.description !== undefined) {
    shop.description = data.description;
  }

  if (data.phone !== undefined) {
    shop.phone = data.phone;
  }

  if (data.email !== undefined) {
    shop.email = data.email;
  }

  if (data.address !== undefined) {
    shop.address = data.address;
  }

  if (data.services !== undefined) {
    shop.services = data.services;
  }

  if (data.latitude !== undefined || data.longitude !== undefined) {
    const [currentLongitude, currentLatitude] = shop.location.coordinates;
    const latitude = data.latitude ?? currentLatitude;
    const longitude = data.longitude ?? currentLongitude;

    shop.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
  }

  await shop.save();

  return shop;
};

export const deleteShop = async (
  id: string,
  user: { userId: string; role: UserRole }
) => {
  const shop = await Shop.findById(id);

  if (!shop) {
    throw new ApiError(404, "Shop not found");
  }

  assertShopAccess(shop, user);

  await shop.deleteOne();

  return shop;
};

export const getOverviewStats = async ({
  userId,
  role,
}: {
  userId: string;
  role: UserRole;
}): Promise<OverviewStats> => {
  const shopFilter =
    role === "admin" ? {} : { owner: new mongoose.Types.ObjectId(userId) };
  const jobFilter =
    role === "admin" ? {} : { createdBy: new mongoose.Types.ObjectId(userId) };

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [activeShops, pendingVerification, openJobs, profileViewsResult, jobIds] =
    await Promise.all([
      Shop.countDocuments({ ...shopFilter, status: SHOP_STATUS.APPROVED }),
      Shop.countDocuments({ ...shopFilter, status: SHOP_STATUS.PENDING }),
      Job.countDocuments({ ...jobFilter, jobStatus: JOB_STATUS.OPEN }),
      Shop.aggregate([
        { $match: shopFilter },
        { $group: { _id: null, total: { $sum: "$views" } } },
      ]),
      Job.find(jobFilter).select("_id").lean(),
    ]);

  const jobIdList = jobIds.map((job) => job._id);

  const newApplicants =
    jobIdList.length === 0
      ? 0
      : await Application.countDocuments({
          job: { $in: jobIdList },
          createdAt: { $gte: sevenDaysAgo },
        });

  return {
    activeShops,
    pendingVerification,
    openJobs,
    newApplicants,
    profileViews: profileViewsResult[0]?.total ?? 0,
  };
};

const getApprovedNearbyShops = async ({
  latitude,
  longitude,
  radius,
}: SearchNearbyParams) => {
  return Shop.find({
    status: SHOP_STATUS.APPROVED,

    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: radius,
      },
    },
  });
};

export const getNearbyShops = async ({   // Get nearby shops from Google Places and ElectroConnect
  latitude,
  longitude,
  radius,
  page=1,
  limit=10,
}: SearchNearbyParams): Promise<
{
  shops: NearbyShop[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> => {
  const [googlePlaces, manualShops] = await Promise.all([
    searchNearbyShops({
      latitude,
      longitude,
      radius,
    }),

    getApprovedNearbyShops({
      latitude,
      longitude,
      radius,
    }),
  ]);

  const googleShops = googlePlaces
    .map((place) =>
      normalizeGoogleShop(
        place,
        latitude,
        longitude,
      ),
    )
    .filter(
      (shop): shop is NearbyShop => shop !== null,
    );

  const manualNearbyShops =
  manualShops.map((shop) =>
      normalizeManualShop(
        shop,
        latitude,
        longitude,
      ),
    );

    const allShops = [
      ...googleShops,
      ...manualNearbyShops,
    ].sort(
      (a, b) => a.distance - b.distance,
    );
  
    // Pagination
    const total = allShops.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
  
    const shops = allShops.slice(
      skip,
      skip + limit,
    );
  
    return {
      shops,
      total,
      page,
      limit,
      totalPages,
    };
};
