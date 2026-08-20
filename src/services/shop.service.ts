import Shop from "../models/shop.model";
import { CreateShopInput } from "../types/shop.types";

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
