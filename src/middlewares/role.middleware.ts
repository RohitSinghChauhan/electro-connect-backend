import { NextFunction, Request, Response } from "express";
import { UserRole } from "../types/auth.types";
import { ApiError } from "../utils/api-error";

export const authorizeRoles =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You are not authorized to perform this action");
    }

    next();
  };