import { Router } from "express";
import {
  createShopController,
  deleteShopController,
  getMyShopsController,
  getNearbyGoogleShopsController,
  getNearbyShopsController,
  getOverviewStatsController,
  updateShopController,
} from "../controllers/shop.controller";
import { validate } from "../middlewares/validate";
import {
  createShopSchema,
  nearbyShopsQuerySchema,
  shopIdParamsSchema,
  shopQuerySchema,
  updateShopSchema,
} from "../validations/shop.validation";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  authorizeRoles("admin", "shopOwner"),
  validate(createShopSchema, "body"),
  createShopController,
);

router.get(
  "/my",
  authMiddleware,
  authorizeRoles("admin", "shopOwner"),
  validate(shopQuerySchema, "query"),
  getMyShopsController,
);

router.get(
  "/overview",
  authMiddleware,
  authorizeRoles("admin", "shopOwner"),
  getOverviewStatsController,
);

router.patch(
  "/update/:id",
  authMiddleware,
  authorizeRoles("admin", "shopOwner"),
  validate(shopIdParamsSchema, "params"),
  validate(updateShopSchema, "body"),
  updateShopController,
);

router.delete(
  "/delete/:id",
  authMiddleware,
  authorizeRoles("admin", "shopOwner"),
  validate(shopIdParamsSchema, "params"),
  deleteShopController,
);

router.get(
  "/nearby",
  validate(nearbyShopsQuerySchema, "query"),
  getNearbyShopsController,
);

router.get(
  "/nearby/google",
  validate(nearbyShopsQuerySchema, "query"),
  getNearbyGoogleShopsController,
);

export default router;
