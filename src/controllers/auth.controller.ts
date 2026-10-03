import { Request, Response } from "express";
import {
  loginAdmin,
  loginCustomer,
  loginShopOwner,
  registerAdmin,
  signupCustomer,
  signupShopOwner,
  verifyCustomerOtp,
  verifyShopOwnerOtp,
} from "../services/auth.service";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const customerSignupController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, phone } = req.body;
    const customer = await signupCustomer({ name, phone });

    res
      .status(201)
      .json(new ApiResponse(201, "Customer registered successfully", customer));
  }
);

export const customerLoginController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { phone } = req.body;
    const result = await loginCustomer({ phone });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Customer found. Proceed with OTP verification",
          result
        )
      );
  }
);

export const customerVerifyOtpController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { firebaseToken } = req.body;
    const result = await verifyCustomerOtp(firebaseToken);

    res
      .status(200)
      .json(new ApiResponse(200, "Phone verified successfully", result));
  }
);

export const shopOwnerSignupController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, phone, password } = req.body;
    const shopOwner = await signupShopOwner({ name, phone, password });

    res
      .status(201)
      .json(
        new ApiResponse(201, "Shop owner registered successfully", shopOwner)
      );
  }
);

export const shopOwnerVerifyOtpController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { firebaseToken } = req.body;
    const result = await verifyShopOwnerOtp(firebaseToken);

    res
      .status(200)
      .json(new ApiResponse(200, "Phone verified successfully", result));
  }
);

export const shopOwnerLoginController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { phone, password } = req.body;
    const result = await loginShopOwner({ phone, password });

    res.status(200).json(new ApiResponse(200, "Login successful", result));
  }
);

export const adminRegisterController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    const result = await registerAdmin({ name, email, password });

    res
      .status(201)
      .json(new ApiResponse(201, "Admin registered successfully", result));
  }
);

export const adminLoginController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await loginAdmin({ email, password });

    res.status(200).json(new ApiResponse(200, "Login successful", result));
  }
);
