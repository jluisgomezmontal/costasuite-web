// User types
export type UserRole = 'admin' | 'agent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthTokens {
  token: string;
  user: User;
}

// Property types
export type PropertyType = 'sale' | 'rent';
export type PropertyStatus = 'available' | 'sold' | 'rented';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates: Coordinates;
}

export interface Features {
  bedrooms: number;
  bathrooms: number;
  area: number;
  parkingSpots?: number;
  yearBuilt?: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  location: Location;
  features: Features;
  images: string[];
  amenities: string[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner?: User;
}

export interface PropertyFormData {
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  location: Location;
  features: Features;
  images: string[];
  amenities: string[];
}
