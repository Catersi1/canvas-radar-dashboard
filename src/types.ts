export type Industry = 'Real Estate' | 'Insurance' | 'Solar' | 'Property Management' | 'Government' | 'Home Services';
export type SubscriptionStatus = 'Active' | 'Past Due' | 'Cancelled';
export type SurveyStatus = 'Pending' | 'In Progress' | 'Completed' | 'Review Required' | 'pending' | 'complete';
export type PropertyType = 'Residential' | 'Commercial' | 'residential' | 'commercial';

export interface Customer {
  id: string;
  name: string;
  industry: Industry;
  tier: string;
  monthlySubscription: number;
  surveysUsed: number;
  surveyLimit: number;
  renewalDate: string;
  status: SubscriptionStatus;
  contactName: string;
  email: string;
}

export interface Surveyor {
  id: string;
  name: string;
  email: string;
  phone: string;
  territory: string;
  surveysCompletedToday: number;
  surveysCompletedWeek: number;
  surveysCompletedMonth: number;
  earningsToday: number;
  earningsWeek: number;
  earningsMonth: number;
  rating: number;
  status: 'Active' | 'Inactive' | 'On Break';
  coverage_pct: number;
  projected_bonus: number;
  base_pay: number;
}

export interface Territory {
  id: string;
  name: string;
  assigned_surveyor_id: string;
  total_properties: number;
  completed_properties: number;
  coverage_pct: number;
  status: 'Critical' | 'Warning' | 'Healthy';
}

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
  
  // Lead Management Fields
  business_name?: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  website?: string;
  employee_count_est?: string;
  industry?: string;
  lead_status?: 'new' | 'contacted' | 'callback' | 'not_interested' | 'booked';
  lead_source?: string;
  notes?: string;
}

export interface Survey {
  id: string;
  address: string;
  type: PropertyType;
  surveyorName: string;
  customerName: string;
  date: string;
  status: SurveyStatus;
  completionPercentage: number;
  photos: string[];
  safety_acknowledged: boolean;
  safety_acknowledged_at?: string;
  quality_score: number;
  validation_flags: string[];
  skip_logic_info?: { [key: string]: string };
  
  // Additional fields from dashboard types
  property_id?: string;
  surveyor_id?: string;
  customer_id?: string;
  earnings?: number;
  progress?: number;
  roof_condition?: string;
  house_condition?: string;
  paint_condition?: string;
  vehicle_count?: number;
  has_solar_panels?: string;
  is_for_sale?: string;
  is_for_rent?: string;
  is_abandoned?: string;
  notes?: string;
  created_at?: string;
  submitted_at?: string;
  
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

export const INDUSTRIES: Industry[] = ['Real Estate', 'Insurance', 'Solar', 'Property Management', 'Government', 'Home Services'];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Greystar', industry: 'Property Management', tier: 'Enterprise', monthlySubscription: 4500, surveysUsed: 120, surveyLimit: 200, renewalDate: '2026-03-15', status: 'Active', contactName: 'Sarah Miller', email: 'sarah@greystar.com' },
  { id: '2', name: 'Auto-Owners', industry: 'Insurance', tier: 'Enterprise', monthlySubscription: 5000, surveysUsed: 450, surveyLimit: 500, renewalDate: '2026-03-20', status: 'Active', contactName: 'John Davis', email: 'john.davis@auto-owners.com' },
  { id: '3', name: 'SunPower', industry: 'Solar', tier: 'Pro', monthlySubscription: 2500, surveysUsed: 85, surveyLimit: 100, renewalDate: '2026-03-10', status: 'Active', contactName: 'Mike Wilson', email: 'm.wilson@sunpower.com' },
  { id: '4', name: 'American Home Shield', industry: 'Home Services', tier: 'Enterprise', monthlySubscription: 3000, surveysUsed: 150, surveyLimit: 150, renewalDate: '2026-04-01', status: 'Past Due', contactName: 'Elon M.', email: 'support@ahs.com' },
  { id: '5', name: 'Compass', industry: 'Real Estate', tier: 'Pro', monthlySubscription: 1200, surveysUsed: 45, surveyLimit: 60, renewalDate: '2026-03-25', status: 'Active', contactName: 'Linda Carter', email: 'linda@compass.com' },
  { id: '6', name: 'Crawford & Co', industry: 'Insurance', tier: 'Enterprise', monthlySubscription: 4800, surveysUsed: 320, surveyLimit: 400, renewalDate: '2026-03-12', status: 'Active', contactName: 'Robert Fox', email: 'rfox@crawco.com' },
  { id: '7', name: 'Roofing Pros', industry: 'Home Services', tier: 'Basic', monthlySubscription: 500, surveysUsed: 12, surveyLimit: 20, renewalDate: '2026-03-05', status: 'Active', contactName: 'Tom Baker', email: 'tom@roofingpros.com' },
  { id: '8', name: 'County Tax Assessor', industry: 'Government', tier: 'Custom', monthlySubscription: 15000, surveysUsed: 1200, surveyLimit: 2000, renewalDate: '2026-06-30', status: 'Active', contactName: 'Alice Green', email: 'alice.green@county.gov' },
  { id: '9', name: 'Lincoln Property', industry: 'Property Management', tier: 'Pro', monthlySubscription: 2200, surveysUsed: 78, surveyLimit: 100, renewalDate: '2026-03-18', status: 'Cancelled', contactName: 'James Bond', email: 'j.bond@lincoln.com' },
  { id: '10', name: 'City Code Enforcement', industry: 'Government', tier: 'Custom', monthlySubscription: 5000, surveysUsed: 210, surveyLimit: 300, renewalDate: '2026-12-31', status: 'Active', contactName: 'Steve Jobs', email: 'steve@city.gov' },
];

export const MOCK_SURVEYORS: Surveyor[] = [
  { id: 's1', name: 'Alex Rivera', email: 'alex@canvasradar.com', phone: '555-0101', territory: 'Austin North', surveysCompletedToday: 4, surveysCompletedWeek: 22, surveysCompletedMonth: 85, earningsToday: 18, earningsWeek: 98, earningsMonth: 380, rating: 4.9, status: 'Active', coverage_pct: 96, projected_bonus: 50, base_pay: 350 },
  { id: 's2', name: 'Jordan Smith', email: 'jordan@canvasradar.com', phone: '555-0102', territory: 'Austin South', surveysCompletedToday: 3, surveysCompletedWeek: 18, surveysCompletedMonth: 72, earningsToday: 12, earningsWeek: 75, earningsMonth: 310, rating: 4.7, status: 'Active', coverage_pct: 82, projected_bonus: 25, base_pay: 280 },
  { id: 's3', name: 'Casey Johnson', email: 'casey@canvasradar.com', phone: '555-0103', territory: 'Austin East', surveysCompletedToday: 0, surveysCompletedWeek: 15, surveysCompletedMonth: 60, earningsToday: 0, earningsWeek: 60, earningsMonth: 250, rating: 4.8, status: 'On Break', coverage_pct: 75, projected_bonus: 0, base_pay: 250 },
  { id: 's4', name: 'Taylor Lee', email: 'taylor@canvasradar.com', phone: '555-0104', territory: 'Austin West', surveysCompletedToday: 5, surveysCompletedWeek: 25, surveysCompletedMonth: 95, earningsToday: 24, earningsWeek: 115, earningsMonth: 420, rating: 5.0, status: 'Active', coverage_pct: 98, projected_bonus: 75, base_pay: 400 },
  { id: 's5', name: 'Morgan Brown', email: 'morgan@canvasradar.com', phone: '555-0105', territory: 'Downtown', surveysCompletedToday: 2, surveysCompletedWeek: 12, surveysCompletedMonth: 50, earningsToday: 9, earningsWeek: 50, earningsMonth: 210, rating: 4.5, status: 'Inactive', coverage_pct: 45, projected_bonus: 0, base_pay: 210 },
];

export const MOCK_TERRITORIES: Territory[] = [
  { id: 't1', name: 'Austin North', assigned_surveyor_id: 's1', total_properties: 150, completed_properties: 144, coverage_pct: 96, status: 'Healthy' },
  { id: 't2', name: 'Austin South', assigned_surveyor_id: 's2', total_properties: 120, completed_properties: 98, coverage_pct: 82, status: 'Warning' },
  { id: 't3', name: 'Austin East', assigned_surveyor_id: 's3', total_properties: 100, completed_properties: 75, coverage_pct: 75, status: 'Critical' },
  { id: 't4', name: 'Austin West', assigned_surveyor_id: 's4', total_properties: 200, completed_properties: 196, coverage_pct: 98, status: 'Healthy' },
  { id: 't5', name: 'Downtown', assigned_surveyor_id: 's5', total_properties: 80, completed_properties: 36, coverage_pct: 45, status: 'Critical' },
];

export const MOCK_SURVEYS: Survey[] = Array.from({ length: 50 }).map((_, i) => {
  const surveyor = MOCK_SURVEYORS[Math.floor(Math.random() * MOCK_SURVEYORS.length)];
  const customer = MOCK_CUSTOMERS[Math.floor(Math.random() * MOCK_CUSTOMERS.length)];
  const status = ['Pending', 'In Progress', 'Completed', 'Review Required'][Math.floor(Math.random() * 4)] as SurveyStatus;
  const photoCount = Math.floor(Math.random() * 6) + 1;
  const qualityScore = Math.floor(Math.random() * 40) + 60;
  const streetNum = Math.floor(Math.random() * 9999);
  const streetName = ['Oak', 'Maple', 'Cedar', 'Pine', 'Elm'][Math.floor(Math.random() * 5)];
  const address = `${streetNum} ${streetName} St`;
  const type = Math.random() > 0.3 ? 'Residential' : 'Commercial';
  
  return {
    id: `SV-${1000 + i}`,
    address: `${address}, Austin, TX`,
    type,
    surveyorName: surveyor.name,
    surveyor_id: surveyor.id,
    customerName: customer.name,
    customer_id: customer.id,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    submitted_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status,
    completionPercentage: Math.floor(Math.random() * 100),
    photos: Array.from({ length: photoCount }).map((_, j) => `https://picsum.photos/seed/sv-${i}-${j}/600/400`),
    safety_acknowledged: Math.random() > 0.2,
    safety_acknowledged_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    quality_score: qualityScore,
    validation_flags: photoCount < 4 ? ['Missing required photos'] : [],
    skip_logic_info: {
      'Solar Details': 'No panels reported',
      'Pool Safety': 'No pool detected'
    },
    earnings: type === 'Commercial' ? 6 : 3,
    roof_condition: ['Good', 'Fair', 'Poor'][Math.floor(Math.random() * 3)],
    house_condition: ['Good', 'Fair', 'Poor'][Math.floor(Math.random() * 3)],
    paint_condition: ['Good', 'Fair', 'Poor'][Math.floor(Math.random() * 3)],
    vehicle_count: Math.floor(Math.random() * 4),
    has_solar_panels: Math.random() > 0.7 ? 'Yes' : 'No',
    is_for_sale: Math.random() > 0.9 ? 'Yes' : 'No',
    notes: 'Property appears well maintained. No major issues observed.',
    properties: {
      id: `P-${i}`,
      address: address,
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      lat: 30.2672,
      lng: -97.7431,
      type: Math.random() > 0.3 ? 'Residential' : 'Commercial',
      created_at: new Date().toISOString()
    }
  };
});

export const REVENUE_BY_SEGMENT = [
  { name: 'Real Estate', value: 12500 },
  { name: 'Insurance', value: 18000 },
  { name: 'Solar', value: 9500 },
  { name: 'Property Mgmt', value: 14500 },
  { name: 'Government', value: 25000 },
];

export const SURVEYS_OVER_TIME = [
  { date: '2026-02-18', residential: 45, commercial: 12 },
  { date: '2026-02-19', residential: 52, commercial: 15 },
  { date: '2026-02-20', residential: 48, commercial: 18 },
  { date: '2026-02-21', residential: 30, commercial: 8 },
  { date: '2026-02-22', residential: 25, commercial: 5 },
  { date: '2026-02-23', residential: 58, commercial: 22 },
  { date: '2026-02-24', residential: 65, commercial: 25 },
];
