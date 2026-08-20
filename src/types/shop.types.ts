import { Document, Types } from "mongoose";

// Manual Shops Types
export type ShopStatus = -1 | 0 | 1; // rejected | pending | approved

export interface IShop extends Document {
  owner: Types.ObjectId;
  name: string;
  description?: string;
  phone: string;
  email?: string;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  services: string[];
  status: ShopStatus;
}

export interface CreateShopInput {
  ownerId: string;
  name: string;
  description?: string;
  phone: string;
  email?: string;
  address: string;
  latitude: number;
  longitude: number;
  services: string[];
}

// Google Places Types
export interface SearchNearbyParams {
  latitude: number;
  longitude: number;
  radius: number;
}

export interface GooglePlaceLocation {
  latitude: number;
  longitude: number;
}

export interface GoogleLocalizedText {
  text: string;
  languageCode?: string;
}

export interface GooglePlace {
  id: string;
  displayName?: GoogleLocalizedText;
  formattedAddress?: string;
  location?: GooglePlaceLocation;
  googleMapsUri?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  types?: string[];
  primaryType?: string;
  primaryTypeDisplayName?: GoogleLocalizedText;
  editorialSummary?: GoogleLocalizedText;
}