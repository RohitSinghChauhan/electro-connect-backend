import { GooglePlace, SearchNearbyParams } from "../types/shop.types";

const PLACES_TEXT_URL = "https://places.googleapis.com/v1/places:searchText";

const PLACES_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.googleMapsUri",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  "places.rating",
  "places.types",
  "places.primaryType",
  "places.primaryTypeDisplayName",
  "places.editorialSummary",
].join(",");

const TEXT_QUERIES = [
  // Core appliance stores (broad)
  "electroncis store near me",
  "consumer electronics showroom",

  // Brand-specific dealers (highly reliable results)
  "Samsung LG Whirlpool Haier dealer showroom",
  "Voltas Daikin Blue Star AC dealer",
  "Sony Panasonic LED TV showroom",
  "Godrej Bosch IFB washing machine store",
  "Havells Bajaj electrical appliances store",

  // Category-specific
  "air conditioner AC dealer shop",
  "refrigerator fridge dealer store",
  "washing machine dealer store",
  "LED TV television showroom dealer",
  "microwave oven water purifier store",
  "geyser water heater chimney dealer",

  // Indian retail chain names (very precise)
  "Vijay Sales Croma Reliance Digital store",
  "Pai International Great Eastern Electronics",

  // Repair + service (catches service centers too)
  "AC refrigerator TV washing machine repair service center",
  "home appliance service center near me",

  "TV AC refrigerator washing machine home appliance store",
  "electronics store TV fridge washing machine",
  "AC TV washing machine refrigerator dealer",
  "appliance repair AC repair washing machine refrigerator TV repair",
];

const REJECT_NAME_PATTERNS = [
  /\bmobiles?\b/i,
  /\bcell\s*phones?\b/i,
  /\baccessories\b/i,
  /\bcovers?\b/i,
  /\bgadgets?\b/i,
  /\bcomputers?\b/i,
  /\blaptops?\b/i,
  /\binfotech\b/i,
  /\bit\s+solutions\b/i,
];

const KEEP_NAME_PATTERNS = [
  /\bappliances?\b/i,
  /\belectronics?\b/i,
  /\belectricals?\b/i,
  /\bdigital\b/i,
  /\btvs?\b/i,
  /\btelevisions?\b/i,
  /\bacs?\b/i,
  /\bair\s*conditioners?\b/i,
  /\bcoolers?\b/i,
  /\bwashing\b/i,
  /\brefrigerators?\b/i,
  /\bfridges?\b/i,
  /\bmicrowaves?\b/i,
  /\bgeysers?\b/i,
  /\brepairs?\b/i,
  /\bservic(?:e|es|ing)\b/i,
];

const getPlaceName = (place: GooglePlace): string =>
  place.displayName?.text ?? "";

const matchesAny = (value: string, patterns: RegExp[]): boolean =>
  patterns.some((pattern) => pattern.test(value));

const isLikelyPhoneOrComputerShop = (place: GooglePlace): boolean => {
  const name = getPlaceName(place);
  const types = place.types ?? [];
  const shouldKeep = matchesAny(name, KEEP_NAME_PATTERNS);

  if (place.primaryType === "cell_phone_store" && !shouldKeep) {
    return true;
  }

  if (types.includes("cell_phone_store") && !shouldKeep) {
    return true;
  }

  return matchesAny(name, REJECT_NAME_PATTERNS) && !shouldKeep;
};

const isWithinRadius = (
  place: GooglePlace,
  { latitude, longitude, radius }: SearchNearbyParams,
): boolean => {
  if (!place.location) {
    return false;
  }

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusMeters = 6371000;
  const dLat = toRadians(place.location.latitude - latitude);
  const dLng = toRadians(place.location.longitude - longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(latitude)) *
      Math.cos(toRadians(place.location.latitude)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * earthRadiusMeters * Math.asin(Math.sqrt(a)) <= radius;
};

const dedupePlaces = (places: GooglePlace[]): GooglePlace[] => {
  const seen = new Set<string>();

  return places.filter((place) => {
    if (!place.id || seen.has(place.id)) {
      return false;
    }

    seen.add(place.id);
    return true;
  });
};

const searchTextPlaces = async (
  { latitude, longitude, radius }: SearchNearbyParams,
  textQuery: string,
): Promise<GooglePlace[]> => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is not set");
  }

  const response = await fetch(PLACES_TEXT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": PLACES_FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery,
      pageSize: 20,
      rankPreference: "DISTANCE",
      locationBias: {
        circle: {
          center: { latitude, longitude },
          radius,
        },
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Google Places API request failed");
  }

  return data.places || [];
};

export const searchNearbyShops = async (
  params: SearchNearbyParams,
): Promise<GooglePlace[]> => {
  const results = await Promise.all(
    TEXT_QUERIES.map((query) => searchTextPlaces(params, query)),
  );

  return dedupePlaces(results.flat()).filter(
    (place) =>
      !isLikelyPhoneOrComputerShop(place) && isWithinRadius(place, params),
  );
};
