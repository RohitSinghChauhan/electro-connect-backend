import { z } from "zod";

export const createShopSchema = z.object({
  name: z
    .string()
    .min(2, "Shop name must be at least 2 characters"),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),

  email: z
    .string()
    .email("Invalid email address")
    .optional(),

  address: z
    .string()
    .min(5, "Address is required"),

  latitude: z
    .number()
    .min(-90)
    .max(90),

  longitude: z
    .number()
    .min(-180)
    .max(180),

  services: z
    .array(z.string().min(1))
    .default([]),
});


// For GooglePlaces feature
export const nearbyShopsQuerySchema = z.object({
  lat: z.coerce.number({ message: "Latitude is required" }),
  lng: z.coerce.number({ message: "Longitude is required" }),
  radius: z.coerce.number().positive().default(2000),
});