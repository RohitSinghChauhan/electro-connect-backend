import mongoose from "mongoose";

import { SERVICE_ORDER_STATUS, ServiceOrderStatus, SHOP_STATUS } from "../constants";
import ServiceOrder from "../models/service-order.model";
import Shop from "../models/shop.model";
import User from "../models/user.model";
import { UserRole } from "../types/auth.types";
import {
  CreateServiceOrderInput,
  IServiceOrder,
  ServiceOrderResponse,
} from "../types/service-order.types";
import { ApiError } from "../utils/api-error";

const SHOP_STATUS_TRANSITIONS: Partial<
  Record<ServiceOrderStatus, ServiceOrderStatus[]>
> = {
  [SERVICE_ORDER_STATUS.PENDING]: [
    SERVICE_ORDER_STATUS.ACCEPTED,
    SERVICE_ORDER_STATUS.REJECTED,
  ],
  [SERVICE_ORDER_STATUS.ACCEPTED]: [
    SERVICE_ORDER_STATUS.ON_THE_WAY,
    SERVICE_ORDER_STATUS.COMPLETED,
  ],
  [SERVICE_ORDER_STATUS.ON_THE_WAY]: [SERVICE_ORDER_STATUS.COMPLETED],
};

const formatServiceOrder = (order: IServiceOrder): ServiceOrderResponse => {
  const [longitude, latitude] = order.location.coordinates;

  return {
    id: order._id.toString(),
    customerId: order.customer.toString(),
    shopId: order.shop.toString(),
    shopOwnerId: order.shopOwner.toString(),
    shopName: order.shopName,
    service: order.service,
    status: order.status,
    customerName: order.customerName,
    phone: order.phone,
    address: order.address,
    latitude,
    longitude,
    notes: order.notes,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

const assertObjectId = (id: string, label: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, `Invalid ${label}`);
  }
};

export const createServiceOrder = async ({
  customerId,
  shopId,
  service,
  address,
  latitude,
  longitude,
  customerName,
  phone,
  notes,
}: CreateServiceOrderInput) => {
  assertObjectId(shopId, "shop id");

  const [shop, customer] = await Promise.all([
    Shop.findById(shopId),
    User.findById(customerId).select("name phone"),
  ]);

  if (!shop) {
    throw new ApiError(404, "Shop not found");
  }

  if (shop.status !== SHOP_STATUS.APPROVED) {
    throw new ApiError(400, "This shop is not available for booking");
  }

  if (!(shop.services ?? []).includes(service)) {
    throw new ApiError(400, "This shop does not provide the selected service");
  }

  if (!customer) {
    throw new ApiError(404, "User not found");
  }

  const resolvedName = customerName || customer.name;
  const resolvedPhone = phone || customer.phone;

  if (!resolvedPhone) {
    throw new ApiError(400, "Phone number is required");
  }

  const order = await ServiceOrder.create({
    customer: customerId,
    shop: shop._id,
    shopOwner: shop.owner,
    shopName: shop.name,
    service,
    status: SERVICE_ORDER_STATUS.PENDING,
    customerName: resolvedName,
    phone: resolvedPhone,
    address,
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    notes,
  });

  return formatServiceOrder(order);
};

const listServiceOrders = async ({
  filter,
  page,
  limit,
}: {
  filter: Record<string, unknown>;
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    ServiceOrder.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ServiceOrder.countDocuments(filter),
  ]);

  return {
    orders: items.map(formatServiceOrder),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getMyServiceOrders = async ({
  customerId,
  page,
  limit,
  status,
}: {
  customerId: string;
  page: number;
  limit: number;
  status?: ServiceOrderStatus;
}) => {
  const filter: Record<string, unknown> = { customer: customerId };

  if (status) {
    filter.status = status;
  }

  return listServiceOrders({ filter, page, limit });
};

export const getIncomingServiceOrders = async ({
  userId,
  page,
  limit,
  status,
  shopId,
}: {
  userId: string;
  page: number;
  limit: number;
  status?: ServiceOrderStatus;
  shopId?: string;
}) => {
  if (shopId) {
    assertObjectId(shopId, "shop id");

    const shop = await Shop.findById(shopId).select("owner");

    if (!shop) {
      throw new ApiError(404, "Shop not found");
    }

    if (shop.owner.toString() !== userId) {
      throw new ApiError(403, "You are not authorized to perform this action");
    }
  }

  const filter: Record<string, unknown> = {
    shopOwner: userId,
  };

  if (shopId) {
    filter.shop = shopId;
  }

  if (status) {
    filter.status = status;
  }

  return listServiceOrders({ filter, page, limit });
};

export const updateServiceOrderStatus = async (
  id: string,
  status: ServiceOrderStatus,
  user: { userId: string; role: UserRole },
) => {
  assertObjectId(id, "service order id");

  const order = await ServiceOrder.findById(id);

  if (!order) {
    throw new ApiError(404, "Service order not found");
  }

  if (status === SERVICE_ORDER_STATUS.CANCELLED) {
    if (user.role !== "customer" || order.customer.toString() !== user.userId) {
      throw new ApiError(403, "Only the customer who placed this order can cancel it");
    }

    if (
      order.status !== SERVICE_ORDER_STATUS.PENDING &&
      order.status !== SERVICE_ORDER_STATUS.ACCEPTED
    ) {
      throw new ApiError(400, "This order can no longer be cancelled");
    }

    order.status = SERVICE_ORDER_STATUS.CANCELLED;
    await order.save();

    return formatServiceOrder(order);
  }

  if (user.role === "customer") {
    throw new ApiError(400, "Customers can only cancel an order");
  }

  if (user.role !== "admin" && order.shopOwner.toString() !== user.userId) {
    throw new ApiError(403, "You are not authorized to perform this action");
  }

  const allowed = SHOP_STATUS_TRANSITIONS[order.status] ?? [];

  if (!allowed.includes(status)) {
    throw new ApiError(
      400,
      `Cannot change an order from ${order.status} to ${status}`,
    );
  }

  order.status = status;
  await order.save();

  return formatServiceOrder(order);
};
