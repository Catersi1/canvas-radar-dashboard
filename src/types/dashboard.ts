export type PropertyType = 'residential' | 'commercial';
export type SurveyStatus = 'pending' | 'complete';
export type LeadStatus = 'new' | 'contacted' | 'callback' | 'not_interested' | 'booked';

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  type: PropertyType;
  created_at: string;
  business_name?: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  lead_status?: LeadStatus;
  notes?: string;
}

export interface Survey {
  id: string;
  property_id: string;
  surveyor_id: string;
  type: PropertyType;
  status: SurveyStatus;
  earnings: number;
  progress: number;
  roof_condition: string;
  house_condition: string;
  paint_condition: string;
  vehicle_count: number;
  has_solar_panels: string;
  is_for_sale: string;
  is_for_rent: string;
  is_abandoned: string;
  notes: string;
  created_at: string;
  submitted_at: string;
  
  // Commercial Fields
  building_type?: string;
  occupancy?: string;
  business_types?: string[];
  parking_avail?: string;
  zoning_type?: string;

  // External Data
  external_photo_url?: string;
  external_source_url?: string;
  
  // Enriched Data
  sqft?: number;
  year_built?: number;
  last_sale_price?: number;
  last_sale_date?: string;
  lot_size?: string;
  bedrooms?: number;
  bathrooms?: number;
  property_tax?: number;
  estimated_value?: number;
  neighborhood_rating?: string;
  enrichment_status?: 'none' | 'pending' | 'complete' | 'failed';
  enrichment_source?: string;
  enrichment_error?: string;

  // Location & Amenities Data
  closest_grocery?: { name: string; distance: string; miles: number };
  closest_highway?: { name: string; distance: string; miles: number };
  closest_elementary?: { name: string; distance: string; miles: number };
  closest_middle?: { name: string; distance: string; miles: number };
  closest_high?: { name: string; distance: string; miles: number };
  closest_gas?: { name: string; distance: string; miles: number };
  closest_walmart?: { name: string; distance: string; miles: number };
  closest_restaurant?: { name: string; distance: string; miles: number };
  safety_rating?: string;
  safety_notes?: string;

  // Joined property data
  properties?: Property;
}
