import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .regex(
    /^\+[1-9]\d{7,14}$/,
    "Phone must be in E.164 format, for example +919876543210"
  );

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

const nameSchema = z.string().trim().min(1, "Name is required");

export const customerSignupSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
});

export const customerLoginSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  firebaseToken: z.string().trim().min(1, "Firebase token is required"),
});

export const shopOwnerSignupSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

export const shopOwnerLoginSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
});

export const adminRegisterSchema = z.object({
  name: nameSchema,
  email: z.string().trim().email("Invalid email address"),
  password: passwordSchema,
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: passwordSchema,
});

export type CustomerSignupInput = z.infer<typeof customerSignupSchema>;
export type CustomerLoginInput = z.infer<typeof customerLoginSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ShopOwnerSignupInput = z.infer<typeof shopOwnerSignupSchema>;
export type ShopOwnerLoginInput = z.infer<typeof shopOwnerLoginSchema>;
export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
