import { Router } from "express";
import {
  getPendingShopsController,
  approveShopController,
  rejectShopController,
} from "../controllers/admin.controller";
import {
  createLearnController,
  deleteLearnController,
  getAdminLearnByIdController,
  getAdminLearnController,
  updateLearnController,
} from "../controllers/learn.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate";
import { pendingShopsQuerySchema } from "../validations/admin.validation";
import {
  createLearnSchema,
  learnQuerySchema,
  updateLearnSchema,
} from "../validations/learn.validation";

const router = Router();

router.use(
  authMiddleware,
  authorizeRoles("admin")
);

router.get(
  "/shops/pending",
  validate(pendingShopsQuerySchema, "query"),
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

router.post(
  "/learn/create",
  validate(createLearnSchema, "body"),
  createLearnController
);

router.get(
  "/learn/list",
  validate(learnQuerySchema, "query"),
  getAdminLearnController
);

router.get(
  "/learn/details/:id",
  getAdminLearnByIdController
);

router.patch(
  "/learn/update/:id",
  validate(updateLearnSchema, "body"),
  updateLearnController
);

router.delete(
  "/learn/delete/:id",
  deleteLearnController
);

export default router;