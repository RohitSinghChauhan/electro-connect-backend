import { Request, Response } from "express";

import {
  createServiceOrder,
  getIncomingServiceOrders,
  getMyServiceOrders,
  updateServiceOrderStatus,
} from "../services/service-order.service";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import {
  createServiceOrderSchema,
  incomingServiceOrdersQuerySchema,
  serviceOrderIdParamsSchema,
  serviceOrderListQuerySchema,
  updateServiceOrderStatusSchema,
} from "../validations/service-order.validation";

export const createServiceOrderController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const body = createServiceOrderSchema.parse(req.body);

    const order = await createServiceOrder({
      ...body,
      customerId: req.user!.userId,
    });

    res
      .status(201)
      .json(new ApiResponse(201, "Service order placed successfully", order));
  },
);

export const getMyServiceOrdersController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { page, limit, status } = serviceOrderListQuerySchema.parse(req.query);

    const result = await getMyServiceOrders({
      customerId: req.user!.userId,
      page,
      limit,
      status,
    });

    res.status(200).json(
      new ApiResponse(200, "Service orders fetched successfully", result.orders, {
        count: result.orders.length,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      }),
    );
  },
);

export const getIncomingServiceOrdersController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { page, limit, status, shopId } =
      incomingServiceOrdersQuerySchema.parse(req.query);

    const result = await getIncomingServiceOrders({
      userId: req.user!.userId,
      page,
      limit,
      status,
      shopId,
    });

    res.status(200).json(
      new ApiResponse(200, "Service orders fetched successfully", result.orders, {
        count: result.orders.length,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      }),
    );
  },
);

export const updateServiceOrderStatusController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = serviceOrderIdParamsSchema.parse(req.params);
    const { status } = updateServiceOrderStatusSchema.parse(req.body);

    const order = await updateServiceOrderStatus(id, status, {
      userId: req.user!.userId,
      role: req.user!.role,
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Service order updated successfully", order));
  },
);
