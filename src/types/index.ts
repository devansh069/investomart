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

export type PropertyType = 'Apartment' | 'Villa' | 'Independent House' | 'Studio Apartment' | 'Penthouse' | 'Commercial' | 'Plot/Land';
export type ListingType = 'Rent' | 'Sale';
export type FurnishingType = 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished';
export type PropertyStatus = 'ACTIVE' | 'PAUSED' | 'RENTED' | 'EXPIRED' | 'SUBSCRIPTION_PAUSED' | 'PENDING' | 'DRAFT';

export interface Property {
  id: string;
  title: string;
  builderId: string;
  builderName: string;
  builderPhone: string;
  builderVerified: boolean;
  type: PropertyType;
  listingType?: ListingType;
  bhk: number;
  bathrooms?: number;
  rent: number; // Monthly rent or sale price in ₹
  priceDisplay?: string;
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
  status: PropertyStatus;
  postedDate: string;
  viewsCount?: number;
  likesCount?: number;
  inquiriesCount?: number;
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
  searchQuery?: string;
  city: string;
  propertyType: string;
  bhk: number | null;
  bathrooms?: number | null;
  minRent?: number | null;
  maxRent: number | null;
  minArea?: number | null;
  maxArea?: number | null;
  furnishing: string;
  selectedAmenities: string[];
}

export interface BuilderProfile {
  id: string;
  name: string;
  tagline: string;
  logoUrl?: string;
  coverUrl?: string;
  verified: boolean;
  projectsCount: string;
  citiesCount: string;
  customersCount: string;
  rating: number;
  aboutText: string;
  phone: string;
  email: string;
  whatsapp?: string;
  websiteUrl?: string;
}
