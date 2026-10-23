import { apiRequest } from './client';
import type { ApiEnvelope } from './types';
import type { StoredSession } from '../auth/session';
import type { Inquiry, Property, User } from '../../types';

export interface ApiListing {
  id: string;
  source: 'native' | 'legacy_property';
  source_id: string;
  read_only: boolean;
  title: string;
  provider: { id: string; name: string; phone?: string | null; verified: boolean };
  type: string;
  listing_type?: string | null;
  bhk?: number | null;
  bathrooms?: number | null;
  price: number;
  price_display?: string | null;
  deposit?: number | null;
  area_sqft?: number | null;
  furnishing?: string | null;
  city: string;
  location: string;
  address?: string | null;
  description?: string | null;
  amenities: string[];
  image_url?: string | null;
  images: string[];
  status: string;
  posted_at?: string | null;
  views_count?: number;
  inquiries_count?: number;
  details?: Record<string, unknown>;
}

export interface ApiInquiry {
  id: string;
  status: string;
  channel: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
  message?: string | null;
  move_in_date?: string | null;
  created_at?: string | null;
  property?: ApiListing | null;
}

type ApiAccount = StoredSession['account'] & {
  country_code: string;
  profile: Record<string, unknown>;
  avatar_url?: string | null;
};

const fallbackImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80';

export function mapAccount(account: StoredSession['account']): User {
  return {
    id: account.id,
    name: account.name || account.company_name || 'InvestorMart User',
    email: account.email || '',
    phone: account.phone,
    role: ['builder', 'owner', 'broker'].includes(account.role) ? 'builder' : 'customer',
    companyName: account.company_name || undefined,
  };
}

export function mapListing(listing: ApiListing): Property {
  const type = listing.type as Property['type'];
  const furnishing = listing.furnishing as Property['furnishing'];
  return {
    id: listing.id,
    source: listing.source,
    sourceId: listing.source_id,
    readOnly: listing.read_only,
    title: listing.title,
    builderId: listing.provider.id,
    builderName: listing.provider.name,
    builderPhone: listing.provider.phone || '',
    builderVerified: listing.provider.verified,
    type,
    listingType: (listing.listing_type === 'Rent' || listing.listing_type === 'Sale') ? listing.listing_type : 'Sale',
    bhk: listing.bhk || 0,
    bathrooms: listing.bathrooms || undefined,
    rent: listing.price || 0,
    priceDisplay: listing.price_display || undefined,
    deposit: listing.deposit || 0,
    areaSqft: listing.area_sqft || 0,
    furnishing: furnishing || 'Unfurnished',
    city: listing.city || '',
    location: listing.location || '',
    address: listing.address || listing.location || '',
    description: listing.description || '',
    amenities: listing.amenities || [],
    imageUrl: listing.image_url || fallbackImage,
    additionalImages: (listing.images || []).filter((image) => image !== listing.image_url),
    hasVideo: false,
    status: listing.status as Property['status'],
    postedDate: listing.posted_at || '',
    viewsCount: listing.views_count || 0,
    inquiriesCount: listing.inquiries_count || 0,
  };
}

export function mapInquiry(inquiry: ApiInquiry): Inquiry {
  const property = inquiry.property ? mapListing(inquiry.property) : undefined;
  return {
    id: inquiry.id,
    propertyId: property?.id || '',
    propertyTitle: property?.title || 'Property',
    propertyRent: property?.rent || 0,
    propertyLocation: property?.location,
    propertyImage: property?.imageUrl,
    customerName: inquiry.customer_name || 'InvestorMart client',
    customerPhone: inquiry.customer_phone || '',
    customerEmail: inquiry.customer_email || '',
    message: inquiry.message || `${inquiry.channel} enquiry`,
    moveInDate: inquiry.move_in_date || undefined,
    createdAt: inquiry.created_at || '',
    status: inquiry.status as Inquiry['status'],
  };
}

export async function requestOtp(phone: string): Promise<{ challenge_id: string }> {
  const response = await apiRequest<{ challenge_id: string }>('auth/otp/request', { method: 'POST', body: { phone } });
  return response.data;
}

export async function verifyOtp(challengeId: string, phone: string, otp: string): Promise<StoredSession> {
  const response = await apiRequest<{ access_token: string; account: ApiAccount }>('auth/otp/verify', {
    method: 'POST', body: { challenge_id: challengeId, phone, otp },
  });
  return { accessToken: response.data.access_token, account: response.data.account };
}

export async function updateMyProfile(token: string, updates: Record<string, unknown>): Promise<StoredSession['account']> {
  const response = await apiRequest<{ account: ApiAccount }>('me', { method: 'PATCH', body: updates, accessToken: token });
  return response.data.account;
}

export async function fetchListings(query = ''): Promise<Property[]> {
  const response = await apiRequest<ApiListing[]>(`listings${query ? `?${query}` : ''}`);
  return response.data.map(mapListing);
}

export async function fetchFavorites(token: string): Promise<Property[]> {
  const response = await apiRequest<{ listings: ApiListing[] }>('favorites', { accessToken: token });
  return response.data.listings.map(mapListing);
}

export async function toggleFavorite(token: string, property: Property): Promise<boolean> {
  if (!property.source || !property.sourceId) throw new Error('This property cannot be saved.');
  const response = await apiRequest<{ is_favorite: boolean }>(`favorites/${property.source}/${property.sourceId}`, { method: 'PUT', accessToken: token });
  return response.data.is_favorite;
}

export async function submitInquiry(token: string, property: Property, payload: { channel: 'form' | 'call' | 'whatsapp'; name?: string; phone?: string; email?: string; message?: string; move_in_date?: string }): Promise<Inquiry> {
  if (!property.source || !property.sourceId) throw new Error('This property cannot receive enquiries.');
  const response = await apiRequest<{ inquiry: ApiInquiry }>('inquiries', {
    method: 'POST', accessToken: token,
    body: { listing_source: property.source, listing_id: property.sourceId, ...payload },
  });
  return mapInquiry(response.data.inquiry);
}

export async function fetchProviderDashboard(token: string): Promise<{ listings: Property[]; capacity: { total: number; active: number; plan_hold: number } }> {
  const response = await apiRequest<{ listings: ApiListing[]; listing_capacity: { total: number; active: number; plan_hold: number } }>('provider/dashboard', { accessToken: token });
  return { listings: response.data.listings.map(mapListing), capacity: response.data.listing_capacity };
}

export async function fetchProviderInquiries(token: string): Promise<Inquiry[]> {
  const response = await apiRequest<{ inquiries: ApiInquiry[] }>('provider/inquiries', { accessToken: token });
  return response.data.inquiries.map(mapInquiry);
}

export async function updateInquiryStatus(token: string, id: string, status: string): Promise<void> {
  await apiRequest(`provider/inquiries/${id}/status`, { method: 'PATCH', accessToken: token, body: { status: status.toLowerCase() } });
}

export async function createProviderListing(token: string, payload: Record<string, unknown>): Promise<Property> {
  const response = await apiRequest<{ listing: ApiListing }>('provider/listings', { method: 'POST', accessToken: token, body: payload });
  return mapListing(response.data.listing);
}

export async function updateProviderListingStatus(token: string, property: Property, status: 'active' | 'paused' | 'archived'): Promise<Property> {
  const response = await apiRequest<{ listing: ApiListing }>(`provider/listings/${property.sourceId}/status`, { method: 'PATCH', accessToken: token, body: { status } });
  return mapListing(response.data.listing);
}

export async function logout(token: string): Promise<void> {
  await apiRequest('auth/logout', { method: 'POST', accessToken: token });
}

export async function fetchAdminOverview(token: string): Promise<{ pending: Property[]; inquiries: Inquiry[] }> {
  const [listings, inquiries] = await Promise.all([
    apiRequest<{ listings: ApiListing[] }>('admin/listings?approval_status=pending', { accessToken: token }),
    apiRequest<{ inquiries: ApiInquiry[] }>('admin/inquiries?per_page=20', { accessToken: token }),
  ]);
  return { pending: listings.data.listings.map(mapListing), inquiries: inquiries.data.inquiries.map(mapInquiry) };
}

export async function reviewListing(token: string, property: Property, decision: 'approved' | 'rejected'): Promise<void> {
  if (!property.sourceId) throw new Error('This property cannot be reviewed.');
  await apiRequest(`admin/listings/${property.sourceId}/review`, { method: 'PATCH', accessToken: token, body: { decision } });
}

export type { ApiEnvelope };
