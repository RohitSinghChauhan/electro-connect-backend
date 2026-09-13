import { Router } from "express";

import {
  applyForJobController,
  createJobController,
  deleteJobController,
  getJobApplicationsController,
  getJobByIdController,
  getMyJobsController,
  getPublicJobsController,
  updateJobController,
} from "../controllers/job.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate";
import {
  applyJobSchema,
  createJobSchema,
  jobIdParamsSchema,
  jobQuerySchema,
  updateJobSchema,
} from "../validations/job.validation";

const router = Router();

router.get("/list", validate(jobQuerySchema, "query"), getPublicJobsController);

router.post(
  "/create",
  authMiddleware,
  authorizeRoles("admin", "shopOwner"),
  validate(createJobSchema, "body"),
  createJobController,
);

router.get(
  "/my",
  authMiddleware,
  authorizeRoles("admin", "shopOwner"),
  validate(jobQuerySchema, "query"),
  getMyJobsController,
);

router.get("/details/:id", getJobByIdController);

router.patch(
  "/update/:id",
  authMiddleware,
  authorizeRoles("admin", "shopOwner"),
  validate(updateJobSchema, "body"),
  updateJobController,
);

router.delete(
  "/delete/:id",
  authMiddleware,
  authorizeRoles("admin", "shopOwner"),
  deleteJobController,
);

router.post(
  "/apply/:jobId",
  validate(jobIdParamsSchema, "params"),
  validate(applyJobSchema, "body"),
  applyForJobController,
);

router.get(
  "/applications/:jobId",
  authMiddleware,
  authorizeRoles("admin", "shopOwner"),
  validate(jobIdParamsSchema, "params"),
  validate(jobQuerySchema, "query"),
  getJobApplicationsController,
);

export default router;
