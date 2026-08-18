import jwt from 'jsonwebtoken'
import { UserRole } from "../types/auth.types";

export const generateToken = (userId: string, role: UserRole): string => {
    return jwt.sign(
      {
        userId,
        role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );
  };