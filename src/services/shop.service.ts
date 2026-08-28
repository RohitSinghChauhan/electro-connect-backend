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
}: SearchNearbyParams): Promise<NearbyShop[]> => {
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

  return [
    ...googleShops,
    ...manualNearbyShops,
  ].sort(
    (a, b) => a.distance - b.distance,
  );
};
