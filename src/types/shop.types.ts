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
