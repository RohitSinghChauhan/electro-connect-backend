import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { registerUserService } from "../services/auth.service";

export const registerUserController = asyncHandler(async (req, res): Promise<void> => {
  const { name, email, password } = req.body;

  const result = await registerUserService({ name, email, password });

  res.status(201).json(
    new ApiResponse(201, "User registered successfully", result)
  );
});
