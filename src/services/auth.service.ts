import bcrypt from "bcryptjs";
import { verifyFirebaseIdToken } from "../config/firebase";
import User from "../models/user.model";
import {
  AuthResult,
  CustomerLoginResult,
  IUser,
  PhoneAuthResult,
  PhoneUserProfile,
} from "../types/auth.types";
import { ApiError } from "../utils/api-error";
import { generateToken } from "../utils/jwt";
import {
  AdminLoginInput,
  AdminRegisterInput,
  CustomerLoginInput,
  CustomerSignupInput,
  ShopOwnerLoginInput,
  ShopOwnerSignupInput,
} from "../validations/auth.validation";

const toPhoneProfile = (user: IUser): PhoneUserProfile => {
  if (user.role !== "customer" && user.role !== "shopOwner") {
    throw new ApiError(500, "Invalid user role");
  }

  return {
    id: user._id.toString(),
    name: user.name,
    phone: user.phone ?? "",
    role: user.role,
    isVerified: user.isVerified,
  };
};

const toAdminResult = (user: IUser): AuthResult => ({
  user: {
    id: user._id.toString(),
    name: user.name,
    email: user.email ?? "",
    role: user.role,
  },
  token: generateToken(user._id.toString(), user.role),
});

const assertPhoneAvailable = async (phone: string): Promise<void> => {
  const existingUser = await User.findOne({ phone });

  if (existingUser) {
    throw new ApiError(409, "Phone number already registered");
  }
};

const phoneFromFirebaseToken = async (
  firebaseToken: string
): Promise<string> => {
  let phoneNumber: string | undefined;

  try {
    const decoded = await verifyFirebaseIdToken(firebaseToken);
    phoneNumber = decoded.phone_number;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Invalid or expired Firebase token");
  }

  if (!phoneNumber) {
    throw new ApiError(401, "Firebase token does not contain a phone number");
  }

  return phoneNumber;
};

const verifyOtpForRole = async (
  firebaseToken: string,
  role: "customer" | "shopOwner"
): Promise<PhoneAuthResult> => {
  const phoneNumber = await phoneFromFirebaseToken(firebaseToken);
  const user = await User.findOne({ phone: phoneNumber, role });

  if (!user) {
    throw new ApiError(404, "User not found for this phone number");
  }

  user.isVerified = true;
  await user.save();

  return {
    user: toPhoneProfile(user),
    token: generateToken(user._id.toString(), user.role),
  };
};

export const signupCustomer = async ({
  name,
  phone,
}: CustomerSignupInput): Promise<PhoneUserProfile> => {
  await assertPhoneAvailable(phone);

  const user = await User.create({
    name,
    phone,
    role: "customer",
    isVerified: false,
  });

  return toPhoneProfile(user);
};

export const loginCustomer = async ({
  phone,
}: CustomerLoginInput): Promise<CustomerLoginResult> => {
  const user = await User.findOne({ phone, role: "customer" });

  if (!user) {
    throw new ApiError(404, "Customer not found");
  }

  return { phone };
};

export const verifyCustomerOtp = async (
  firebaseToken: string
): Promise<PhoneAuthResult> => {
  return verifyOtpForRole(firebaseToken, "customer");
};

export const signupShopOwner = async ({
  name,
  phone,
  password,
}: ShopOwnerSignupInput): Promise<PhoneUserProfile> => {
  await assertPhoneAvailable(phone);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    phone,
    password: hashedPassword,
    role: "shopOwner",
    isVerified: false,
  });

  return toPhoneProfile(user);
};

export const verifyShopOwnerOtp = async (
  firebaseToken: string
): Promise<PhoneAuthResult> => {
  return verifyOtpForRole(firebaseToken, "shopOwner");
};

export const loginShopOwner = async ({
  phone,
  password,
}: ShopOwnerLoginInput): Promise<PhoneAuthResult> => {
  const user = await User.findOne({ phone, role: "shopOwner" });

  if (!user || !user.password) {
    throw new ApiError(401, "Invalid phone number or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid phone number or password");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Complete OTP verification before logging in");
  }

  return {
    user: toPhoneProfile(user),
    token: generateToken(user._id.toString(), user.role),
  };
};

export const registerAdmin = async ({
  name,
  email,
  password,
}: AdminRegisterInput): Promise<AuthResult> => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
    isVerified: true,
  });

  return toAdminResult(user);
};

export const loginAdmin = async ({
  email,
  password,
}: AdminLoginInput): Promise<AuthResult> => {
  const user = await User.findOne({ email, role: "admin" });

  if (!user || !user.password) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  return toAdminResult(user);
};
