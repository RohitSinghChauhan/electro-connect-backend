import { Router } from "express";
import {
  createShopController,
  getNearbyGoogleShopsController,
  getNearbyShopsController,
} from "../controllers/shop.controller";
import { validate } from "../middlewares/validate";
import {
  createShopSchema,
  nearbyShopsQuerySchema,
} from "../validations/shop.validation";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.post(
    "/create",
    authMiddleware,
    authorizeRoles("shopOwner"),
    validate(createShopSchema, "body"),
    createShopController,
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
