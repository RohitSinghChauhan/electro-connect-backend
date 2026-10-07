import { z } from "zod";

import { SHOP_SERVICES } from "../constants";

const shopServiceSchema = z.enum(SHOP_SERVICES);

const shopServicesSchema = z
  .array(shopServiceSchema)
  .min(1, "Select at least one service")
  .transform((services) => [...new Set(services)]);

export const shopQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export const shopIdParamsSchema = z.object({
  id: z.string().min(1, "Shop ID is required"),
});

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

  services: shopServicesSchema,

  gstin: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .refine(
      (value) =>
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value),
      { message: "Invalid GSTIN Format" },
    ),
});

export const updateShopSchema = z.object({
  name: z
    .string()
    .min(2, "Shop name must be at least 2 characters")
    .optional(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .optional(),

  email: z
    .string()
    .email("Invalid email address")
    .optional(),

  address: z
    .string()
    .min(5, "Address is required")
    .optional(),

  latitude: z
    .number()
    .min(-90)
    .max(90)
    .optional(),

  longitude: z
    .number()
    .min(-180)
    .max(180)
    .optional(),

  services: shopServicesSchema.optional(),
});

export const nearbyGoogleShopsQuerySchema = z.object({
  lat: z.coerce.number({ message: "Latitude is required" }),
  lng: z.coerce.number({ message: "Longitude is required" }),
  radius: z.coerce.number().positive().default(2000),
});

export const nearbyShopsQuerySchema = z
  .object({
    lat: z.coerce.number().min(-90).max(90).optional(),
    lng: z.coerce.number().min(-180).max(180).optional(),
    search: z
      .string()
      .trim()
      .max(200)
      .optional()
      .transform((value) => (value ? value : undefined))
      .refine((value) => value === undefined || value.length >= 2, {
        message: "Search must be at least 2 characters",
      }),
    service: shopServiceSchema.optional(),
    radius: z.coerce.number().positive().max(30000).default(15000),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
  })
  .refine(
    (data) => {
      if (data.search) {
        return true;
      }

      return data.lat !== undefined && data.lng !== undefined;
    },
    { message: "Provide lat and lng, or a search location" },
  );