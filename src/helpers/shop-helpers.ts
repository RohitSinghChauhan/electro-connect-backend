import { GooglePlace, IShop, NearbyShop } from "../types/shop.types";

export const calculateDistance = (
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number,
  ): number => {
    const toRadians = (degrees: number) => {
      return (degrees * Math.PI) / 180;
    };
  
    const earthRadiusKm = 6371;
  
    const dLatitude = toRadians(latitude2 - latitude1);
    const dLongitude = toRadians(longitude2 - longitude1);
  
    const a =
      Math.sin(dLatitude / 2) ** 2 +
      Math.cos(toRadians(latitude1)) *
        Math.cos(toRadians(latitude2)) *
        Math.sin(dLongitude / 2) ** 2;
  
    const c = 2 * Math.asin(Math.sqrt(a));
  
    return Number((earthRadiusKm * c).toFixed(2));
  };
  
  export const normalizeGoogleShop = (
    place: GooglePlace,
    userLatitude: number,
    userLongitude: number,
  ): NearbyShop | null => {
    if (!place.location) {
      return null;
    }
  
    return {
      id: place.id,
      source: "google",
  
      name: place.displayName?.text ?? "Unknown shop",
  
      address: place.formattedAddress,
      phone: place.nationalPhoneNumber,
      website: place.websiteUri,
  
      latitude: place.location.latitude,
      longitude: place.location.longitude,
  
      rating: place.rating,
      googleMapsUri: place.googleMapsUri,
  
      category: place.primaryTypeDisplayName?.text,
  
      distance: calculateDistance(
        userLatitude,
        userLongitude,
        place.location.latitude,
        place.location.longitude,
      ),
    };
  };
  
  export const normalizeManualShop = (
    shop: IShop,
    userLatitude: number,
    userLongitude: number,
  ): NearbyShop => {
    const [longitude, latitude] = shop.location.coordinates;
  
    return {
      id: shop._id.toString(),
      source: "manual",
  
      name: shop.name,
  
      address: shop.address,
      phone: shop.phone,
      email: shop.email,
  
      description: shop.description,
      services: shop.services,
  
      latitude,
      longitude,
  
      distance: calculateDistance(
        userLatitude,
        userLongitude,
        latitude,
        longitude,
      ),
    };
  };