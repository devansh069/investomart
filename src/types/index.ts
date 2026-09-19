export type UserRole = 'customer' | 'builder';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  companyName?: string;
}

export type PropertyType = 'Apartment' | 'Villa' | 'Independent House' | 'Studio Apartment' | 'Penthouse';
export type FurnishingType = 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished';

export interface Property {
  id: string;
  title: string;
  builderId: string;
  builderName: string;
  builderPhone: string;
  builderVerified: boolean;
  type: PropertyType;
  bhk: number; // 1, 2, 3, 4
  rent: number; // Monthly rent in ₹
  deposit: number; // Security deposit in ₹
  areaSqft: number;
  furnishing: FurnishingType;
  city: string;
  location: string;
  address: string;
  description: string;
  amenities: string[];
  imageUrl: string;
  additionalImages?: string[];
  hasVideo: boolean;
  status: 'AVAILABLE' | 'RENTED';
  postedDate: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyRent: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  message: string;
  moveInDate: string;
  createdAt: string;
  status: 'NEW' | 'CONTACTED' | 'ACCEPTED';
}

export interface GovtResource {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'RERA' | 'Legal' | 'Stamp Duty' | 'Tenancy Act';
  url: string;
  authority: string;
  badge: string;
}

export interface FilterState {
  city: string;
  propertyType: string;
  bhk: number | null;
  maxRent: number | null;
  furnishing: string;
  selectedAmenities: string[];
}
