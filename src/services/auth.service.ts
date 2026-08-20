import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { LoginUserResult, RegisterUserResult } from "../types/auth.types";
import { ApiError } from "../utils/api-error";
import { LoginInput, RegisterInput } from "../validations/auth.validation";
import { generateToken } from "../utils/jwt";

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterInput): Promise<RegisterUserResult> => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "shopOwner",
  });

  const token = generateToken(user._id.toString(), user.role);

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const loginUser = async ({
  email,
  password,
}: LoginInput): Promise<LoginUserResult> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id.toString(), user.role);

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};
