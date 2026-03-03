export type PropertyType = 'residential' | 'commercial';
export type SurveyStatus = 'pending' | 'complete';

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

  // Joined property data
  properties?: Property;
}
