// Services API client for Client Website
// Connects to Velosta Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Types
export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  vendorCount: number;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  state: string;
  image?: string;
  vendorCount: number;
}

export type PriceRange = "BUDGET" | "MODERATE" | "PREMIUM" | "LUXURY";

export interface CatalogueData {
  headers: string[];
  rows: Record<string, string>[];
}

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  coverImage?: string;
  logo?: string;
  images: string[];
  phone: string;
  whatsappNumber: string;
  email?: string;
  website?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  priceRange: PriceRange;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  catalogue?: CatalogueData | null;
  catalogueName?: string;
  location: {
    id: string;
    name: string;
    slug: string;
    state: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
}

export interface VendorsResponse {
  vendors: Vendor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LeadData {
  vendorId: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  type: "WHATSAPP_CLICK" | "CALLBACK_REQUEST";
}

// API Functions
export async function getLocations(): Promise<Location[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/services/locations`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch locations");
    return response.json();
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

export async function getCategories(): Promise<ServiceCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/services/categories`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getVendors(params?: {
  locationSlug?: string;
  categorySlug?: string;
  search?: string;
  priceRange?: PriceRange;
  minRating?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
}): Promise<VendorsResponse> {
  try {
    const query = new URLSearchParams();
    if (params) {
      if (params.locationSlug) query.append("locationSlug", params.locationSlug);
      if (params.categorySlug) query.append("categorySlug", params.categorySlug);
      if (params.search) query.append("search", params.search);
      if (params.priceRange) query.append("priceRange", params.priceRange);
      if (params.minRating) query.append("minRating", String(params.minRating));
      if (params.featured) query.append("featured", "true");
      if (params.page) query.append("page", String(params.page));
      if (params.limit) query.append("limit", String(params.limit));
    }

    const response = await fetch(`${API_BASE_URL}/services/vendors?${query.toString()}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch vendors");
    return response.json();
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return { vendors: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
  }
}

export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/services/vendors/${slug}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch vendor");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return null;
  }
}

export async function getRelatedVendors(slug: string, limit = 4): Promise<Vendor[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/services/vendors/${slug}/related?limit=${limit}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch related vendors");
    return response.json();
  } catch (error) {
    console.error("Error fetching related vendors:", error);
    return [];
  }
}

export async function createLead(data: LeadData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/services/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return { success: false, error: result.error || "Failed to create lead" };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error creating lead:", error);
    return { success: false, error: "Network error" };
  }
}

// Helper functions
export function getLocationBySlug(locations: Location[], slug: string): Location | undefined {
  return locations.find(l => l.slug === slug);
}

export function getCategoryBySlug(categories: ServiceCategory[], slug: string): ServiceCategory | undefined {
  return categories.find(c => c.slug === slug);
}

export function getFeaturedVendors(vendors: Vendor[]): Vendor[] {
  return vendors.filter(v => v.isFeatured);
}
