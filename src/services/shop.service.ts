import mongoose from "mongoose";

import { JOB_STATUS, SERVICE_ORDER_STATUS, SHOP_STATUS, ShopService } from "../constants";
import Application from "../models/application.model";
import Job from "../models/job.model";
import ServiceOrder from "../models/service-order.model";
import Shop from "../models/shop.model";
import { UserRole } from "../types/auth.types";
import {
  CreateShopInput,
  ManualShopRecord,
  NearbyShop,
  OverviewStats,
  UpdateShopInput,
} from "../types/shop.types";
import { ApiError } from "../utils/api-error";
import { normalizeManualShop } from "../helpers/shop-helpers";
import { geocodePlace } from "./geocode.service";

const isDuplicateKeyError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code: number }).code === 11000;

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
  gst,
}: CreateShopInput) => {
  try {
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

      gstin: gst.gstin,
      legalBusinessName: gst.legalBusinessName,
      gst,

      status: SHOP_STATUS.APPROVED,
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
      gstin: shop.gstin,
      legalBusinessName: shop.legalBusinessName,
      gst: shop.gst,
    };
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) {
      throw new ApiError(409, "A shop with this GSTIN already exists");
    }

    throw error;
  }
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

  const serviceOrderFilter = {
    shopOwner: new mongoose.Types.ObjectId(userId),
  };

  const [activeShops, pendingVerification, openJobs, profileViewsResult, jobIds, pendingServiceOrders] =
    await Promise.all([
      Shop.countDocuments({ ...shopFilter, status: SHOP_STATUS.APPROVED }),
      Shop.countDocuments({ ...shopFilter, status: SHOP_STATUS.PENDING }),
      Job.countDocuments({ ...jobFilter, jobStatus: JOB_STATUS.OPEN }),
      Shop.aggregate([
        { $match: shopFilter },
        { $group: { _id: null, total: { $sum: "$views" } } },
      ]),
      Job.find(jobFilter).select("_id").lean(),
      ServiceOrder.countDocuments({
        ...serviceOrderFilter,
        status: SERVICE_ORDER_STATUS.PENDING,
      }),
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
    pendingServiceOrders,
  };
};

export const getNearbyShops = async ({
  latitude,
  longitude,
  search,
  radius,
  page = 1,
  limit = 10,
  service,
}: {
  latitude?: number;
  longitude?: number;
  search?: string;
  radius: number;
  page?: number;
  limit?: number;
  service?: ShopService;
}): Promise<{
  shops: NearbyShop[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  latitude: number;
  longitude: number;
  address?: string;
}> => {
  let resolvedLatitude = latitude;
  let resolvedLongitude = longitude;
  let resolvedAddress: string | undefined;

  if (search) {
    const geocoded = await geocodePlace(search);
    resolvedLatitude = geocoded.latitude;
    resolvedLongitude = geocoded.longitude;
    resolvedAddress = geocoded.address;
  }

  if (resolvedLatitude === undefined || resolvedLongitude === undefined) {
    throw new ApiError(400, "Provide lat and lng, or a search location");
  }

  const searchLatitude = resolvedLatitude;
  const searchLongitude = resolvedLongitude;
  const skip = (page - 1) * limit;
  const geoQuery: Record<string, unknown> = {
    status: SHOP_STATUS.APPROVED,
  };

  if (service) {
    geoQuery.services = service;
  }

  const aggregated = await Shop.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [searchLongitude, searchLatitude],
        },
        distanceField: "distanceMeters",
        maxDistance: radius,
        spherical: true,
        query: geoQuery,
      },
    },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ]);

  const bucket = aggregated[0] as {
    metadata: { total: number }[];
    data: Array<ManualShopRecord & { distanceMeters: number }>;
  };

  const total = bucket?.metadata[0]?.total ?? 0;
  const totalPages = Math.ceil(total / limit);
  const shops = (bucket?.data ?? []).map((shop) => ({
    ...normalizeManualShop(shop, searchLatitude, searchLongitude),
    distance: Number((shop.distanceMeters / 1000).toFixed(2)),
  }));

  return {
    shops,
    total,
    page,
    limit,
    totalPages,
    latitude: searchLatitude,
    longitude: searchLongitude,
    address: resolvedAddress,
  };
};
