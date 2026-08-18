import { z } from "zod";

export const nearbyShopsQuerySchema = z.object({
  lat: z.coerce.number({ message: "Latitude is required" }),
  lng: z.coerce.number({ message: "Longitude is required" }),
  radius: z.coerce.number().positive().default(2000),
});