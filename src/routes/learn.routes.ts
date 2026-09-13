import { Router } from "express";
import { validate } from "../middlewares/validate";
import { learnQuerySchema } from "../validations/learn.validation";
import { getPublishedLearnDetailsController, getPublishedLearnListController } from "../controllers/learn.controller";

const router = Router();

router.get("/list", validate(learnQuerySchema, "query"), getPublishedLearnListController);

router.get("/details/:id", getPublishedLearnDetailsController);

export default router;
