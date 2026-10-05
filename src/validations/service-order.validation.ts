import { z } from "zod";

import { SERVICE_ORDER_STATUS, SHOP_SERVICES } from "../constants";

export const createServiceOrderSchema = z.object({
  shopId: z.string().trim().min(1, "Shop ID is required"),
  service: z.enum(SHOP_SERVICES),
  address: z.string().trim().min(5, "Address is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  customerName: z.string().trim().min(1, "Name is required").optional(),
  phone: z.string().trim().min(10, "Phone number must be at least 10 characters").optional(),
  notes: z.string().trim().max(500, "Notes cannot exceed 500 characters").optional(),
});

export const serviceOrderIdParamsSchema = z.object({
  id: z.string().trim().min(1, "Service order ID is required"),
});

export const serviceOrderListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: z
    .enum([
      SERVICE_ORDER_STATUS.PENDING,
      SERVICE_ORDER_STATUS.ACCEPTED,
      SERVICE_ORDER_STATUS.ON_THE_WAY,
      SERVICE_ORDER_STATUS.COMPLETED,
      SERVICE_ORDER_STATUS.REJECTED,
      SERVICE_ORDER_STATUS.CANCELLED,
    ])
    .optional(),
});

export const incomingServiceOrdersQuerySchema = serviceOrderListQuerySchema.extend({
  shopId: z.string().trim().min(1).optional(),
});

export const updateServiceOrderStatusSchema = z.object({
  status: z.enum([
    SERVICE_ORDER_STATUS.ACCEPTED,
    SERVICE_ORDER_STATUS.REJECTED,
    SERVICE_ORDER_STATUS.ON_THE_WAY,
    SERVICE_ORDER_STATUS.COMPLETED,
    SERVICE_ORDER_STATUS.CANCELLED,
  ]),
});
