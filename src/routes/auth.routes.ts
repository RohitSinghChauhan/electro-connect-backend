import { Router } from "express";
import { registerUserController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { registerSchema } from "../validations/auth.validation";

const router = Router();

router.post("/register", validate(registerSchema, "body"), registerUserController);

export default router;
