import { Router } from "express";
import {
  getPendingShopsController,
  approveShopController,
  rejectShopController,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.use(
  authMiddleware,
  authorizeRoles("admin")
);

router.get(
  "/shops/pending",
  getPendingShopsController
);

router.patch(
  "/shops/:id/approve",
  approveShopController
);

router.patch(
  "/shops/:id/reject",
  rejectShopController
);

export default router;