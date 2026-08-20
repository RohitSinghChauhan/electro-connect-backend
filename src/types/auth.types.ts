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

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResult {
  user: AuthUserResponse;
  token: string;
}

export interface RegisterUserResult extends AuthResult {}

export interface LoginUserResult extends AuthResult {}