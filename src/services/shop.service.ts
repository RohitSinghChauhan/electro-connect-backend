import Shop from "../models/shop.model";
import { CreateShopInput, NearbyShop, SearchNearbyParams } from "../types/shop.types";
import { SHOP_STATUS } from "../constants";
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
