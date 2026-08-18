import { Document } from "mongoose";

export type UserRole = "shopOwner" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthUser {
  userId: string;
  role: UserRole;
}

export interface RegisterUserResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  token: string;
}