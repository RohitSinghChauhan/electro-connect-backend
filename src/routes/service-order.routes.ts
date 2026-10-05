import { Router } from "express";

import {
  createServiceOrderController,
  getIncomingServiceOrdersController,
  getMyServiceOrdersController,
  updateServiceOrderStatusController,
} from "../controllers/service-order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate";
import {
  createServiceOrderSchema,
  incomingServiceOrdersQuerySchema,
  serviceOrderIdParamsSchema,
  serviceOrderListQuerySchema,
  updateServiceOrderStatusSchema,
} from "../validations/service-order.validation";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  authorizeRoles("customer"),
  validate(createServiceOrderSchema, "body"),
  createServiceOrderController,
);

router.get(
  "/my",
  authMiddleware,
  authorizeRoles("customer"),
  validate(serviceOrderListQuerySchema, "query"),
  getMyServiceOrdersController,
);

router.get(
  "/incoming",
  authMiddleware,
  authorizeRoles("admin", "shopOwner"),
  validate(incomingServiceOrdersQuerySchema, "query"),
  getIncomingServiceOrdersController,
);

router.patch(
  "/update-status/:id",
  authMiddleware,
  authorizeRoles("customer", "shopOwner", "admin"),
  validate(serviceOrderIdParamsSchema, "params"),
  validate(updateServiceOrderStatusSchema, "body"),
  updateServiceOrderStatusController,
);

export default router;
