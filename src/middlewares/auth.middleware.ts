import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { AuthUser } from "../types/auth.types";
import { ApiError } from "../utils/api-error";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Authentication token missing");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthUser;

    req.user = decoded;

    next();
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
};