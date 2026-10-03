import { Document } from "mongoose";

export type UserRole = "customer" | "shopOwner" | "admin";

export interface IUser extends Document {
  name: string;
  email?: string;
  password?: string;
  phone?: string;
  isVerified: boolean;
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

export interface PhoneUserProfile {
  id: string;
  name: string;
  phone: string;
  role: "customer" | "shopOwner";
  isVerified: boolean;
}

export interface PhoneAuthResult {
  user: PhoneUserProfile;
  token: string;
}

export interface CustomerLoginResult {
  phone: string;
}
