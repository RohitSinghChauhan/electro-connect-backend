import { Router } from "express";
import {
  loginUserController,
  registerUserController,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginSchema, registerSchema } from "../validations/auth.validation";

const router = Router();

router.post(
  "/register",
  validate(registerSchema, "body"),
  registerUserController,
);

router.post("/login", validate(loginSchema, "body"), loginUserController);

export default router;
