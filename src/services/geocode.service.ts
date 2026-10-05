import { ApiError } from "../utils/api-error";

interface GeocodeResult {
  latitude: number;
  longitude: number;
  address: string;
}

interface GoogleGeocodeResponse {
  status: string;
  error_message?: string;
  results?: Array<{
    formatted_address?: string;
    geometry?: {
      location?: {
        lat: number;
        lng: number;
      };
    };
  }>;
}

export const geocodePlace = async (address: string): Promise<GeocodeResult> => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new ApiError(500, "Location search is not configured");
  }

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);
  const data = (await response.json()) as GoogleGeocodeResponse;

  if (!response.ok) {
    throw new ApiError(502, "Location search failed");
  }

  if (data.status === "ZERO_RESULTS" || data.status === "INVALID_REQUEST") {
    throw new ApiError(400, "No location found for that search");
  }

  if (data.status !== "OK") {
    throw new ApiError(502, data.error_message || "Location search failed");
  }

  const match = data.results?.[0];
  const location = match?.geometry?.location;

  if (!match || !location || !match.formatted_address) {
    throw new ApiError(400, "No location found for that search");
  }

  return {
    latitude: location.lat,
    longitude: location.lng,
    address: match.formatted_address,
  };
};
