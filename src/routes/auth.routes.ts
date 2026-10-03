import { Router } from "express";
import {
  adminLoginController,
  adminRegisterController,
  customerLoginController,
  customerSignupController,
  customerVerifyOtpController,
  shopOwnerLoginController,
  shopOwnerSignupController,
  shopOwnerVerifyOtpController,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import {
  adminLoginSchema,
  adminRegisterSchema,
  customerLoginSchema,
  customerSignupSchema,
  shopOwnerLoginSchema,
  shopOwnerSignupSchema,
  verifyOtpSchema,
} from "../validations/auth.validation";

const router = Router();

router.post(
  "/customer/signup",
  validate(customerSignupSchema, "body"),
  customerSignupController
);

router.post(
  "/customer/login",
  validate(customerLoginSchema, "body"),
  customerLoginController
);

router.post(
  "/customer/verify-otp",
  validate(verifyOtpSchema, "body"),
  customerVerifyOtpController
);

router.post(
  "/shop-owner/signup",
  validate(shopOwnerSignupSchema, "body"),
  shopOwnerSignupController
);

router.post(
  "/shop-owner/verify-otp",
  validate(verifyOtpSchema, "body"),
  shopOwnerVerifyOtpController
);

router.post(
  "/shop-owner/login",
  validate(shopOwnerLoginSchema, "body"),
  shopOwnerLoginController
);

router.post(
  "/admin/register",
  validate(adminRegisterSchema, "body"),
  adminRegisterController
);

router.post(
  "/admin/login",
  validate(adminLoginSchema, "body"),
  adminLoginController
);

export default router;
