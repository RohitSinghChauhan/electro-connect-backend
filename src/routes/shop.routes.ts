import { Router } from "express";
import { getNearbyShopsController } from "../controllers/shop.controller";
import { validate } from "../middlewares/validate";
import { nearbyShopsQuerySchema } from "../validations/shop.validation";

const router = Router();

router.get(
    '/nearby',
    validate(nearbyShopsQuerySchema, 'query'),
    getNearbyShopsController);

export default router;