import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { loginUser, registerUser } from "../services/auth.service";
import { Request, Response } from "express";

export const registerUserController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    const result = await registerUser({ name, email, password });

    res
      .status(201)
      .json(new ApiResponse(201, "User registered successfully", result));
  },
);

export const loginUserController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const result = await loginUser({
      email,
      password,
    });

    res.status(200).json(new ApiResponse(200, "Login successful", result));
  },
);
