export type Industry = 'Real Estate' | 'Insurance' | 'Solar' | 'Property Management' | 'Government' | 'Home Services';
export type SubscriptionStatus = 'Active' | 'Past Due' | 'Cancelled';
export type SurveyStatus = 'Pending' | 'In Progress' | 'Completed' | 'Review Required';
export type PropertyType = 'Residential' | 'Commercial';

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
  { id: 's1', name: 'Alex Rivera', email: 'alex@canvasradar.com', phone: '555-0101', territory: 'Austin, TX', surveysCompletedToday: 4, surveysCompletedWeek: 22, surveysCompletedMonth: 85, earningsToday: 240, earningsWeek: 1320, earningsMonth: 5100, rating: 4.9, status: 'Active' },
  { id: 's2', name: 'Jordan Smith', email: 'jordan@canvasradar.com', phone: '555-0102', territory: 'Dallas, TX', surveysCompletedToday: 3, surveysCompletedWeek: 18, surveysCompletedMonth: 72, earningsToday: 180, earningsWeek: 1080, earningsMonth: 4320, rating: 4.7, status: 'Active' },
  { id: 's3', name: 'Casey Johnson', email: 'casey@canvasradar.com', phone: '555-0103', territory: 'Houston, TX', surveysCompletedToday: 0, surveysCompletedWeek: 15, surveysCompletedMonth: 60, earningsToday: 0, earningsWeek: 900, earningsMonth: 3600, rating: 4.8, status: 'On Break' },
  { id: 's4', name: 'Taylor Lee', email: 'taylor@canvasradar.com', phone: '555-0104', territory: 'San Antonio, TX', surveysCompletedToday: 5, surveysCompletedWeek: 25, surveysCompletedMonth: 95, earningsToday: 300, earningsWeek: 1500, earningsMonth: 5700, rating: 5.0, status: 'Active' },
  { id: 's5', name: 'Morgan Brown', email: 'morgan@canvasradar.com', phone: '555-0105', territory: 'Austin, TX', surveysCompletedToday: 2, surveysCompletedWeek: 12, surveysCompletedMonth: 50, earningsToday: 120, earningsWeek: 720, earningsMonth: 3000, rating: 4.5, status: 'Inactive' },
];

export const MOCK_SURVEYS: Survey[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `SV-${1000 + i}`,
  address: `${Math.floor(Math.random() * 9999)} ${['Oak', 'Maple', 'Cedar', 'Pine', 'Elm'][Math.floor(Math.random() * 5)]} St, Austin, TX`,
  type: Math.random() > 0.3 ? 'Residential' : 'Commercial',
  surveyorName: MOCK_SURVEYORS[Math.floor(Math.random() * MOCK_SURVEYORS.length)].name,
  customerName: MOCK_CUSTOMERS[Math.floor(Math.random() * MOCK_CUSTOMERS.length)].name,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  status: ['Pending', 'In Progress', 'Completed', 'Review Required'][Math.floor(Math.random() * 4)] as SurveyStatus,
  completionPercentage: Math.floor(Math.random() * 100),
}));

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
