import { Property, Survey } from '../types/dashboard';

export const generateMockData = () => {
  const properties: Property[] = [];
  const surveys: Survey[] = [];

  const cities = [
    { name: 'San Francisco', state: 'CA', lat: 37.7749, lng: -122.4194 },
    { name: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
    { name: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060 },
    { name: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431 },
    { name: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918 },
  ];

  const conditions = ['Good', 'Fair', 'Poor'];
  const buildingTypes = ['Office', 'Retail', 'Industrial', 'Warehouse', 'Mixed Use'];
  const occupancyTypes = ['Fully Occupied', 'Partially Occupied', 'Vacant'];

  for (let i = 0; i < 50; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const type = Math.random() > 0.7 ? 'commercial' : 'residential';
    
    const property: Property = {
      id: `prop-${i}`,
      address: `${Math.floor(Math.random() * 9000) + 100} ${['Oak', 'Maple', 'Main', 'Broadway', 'Market', 'Sunset'][Math.floor(Math.random() * 6)]} St`,
      city: city.name,
      state: city.state,
      zip: `${Math.floor(Math.random() * 90000) + 10000}`,
      lat: city.lat + (Math.random() - 0.5) * 0.1,
      lng: city.lng + (Math.random() - 0.5) * 0.1,
      type,
      created_at: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
    };
    properties.push(property);

    const submittedAt = new Date(new Date(property.created_at).getTime() + 3600000);
    const isRecent = (Date.now() - submittedAt.getTime()) < (2 * 24 * 60 * 60 * 1000); // Last 2 days

    const survey: Survey = {
      id: `surv-${i}`,
      property_id: property.id,
      surveyor_id: `user-${Math.floor(Math.random() * 10)}`,
      type: property.type,
      status: isRecent ? 'pending' : (Math.random() > 0.3 ? 'complete' : 'pending'),
      earnings: Math.random() * 50 + 10,
      progress: Math.random() * 100,
      roof_condition: conditions[Math.floor(Math.random() * 3)],
      house_condition: conditions[Math.floor(Math.random() * 3)],
      paint_condition: conditions[Math.floor(Math.random() * 3)],
      vehicle_count: Math.floor(Math.random() * 5),
      has_solar_panels: Math.random() > 0.8 ? 'Yes' : 'No',
      is_for_sale: Math.random() > 0.9 ? 'Yes' : 'No',
      is_for_rent: Math.random() > 0.9 ? 'Yes' : 'No',
      is_abandoned: Math.random() > 0.95 ? 'Yes' : 'No',
      notes: 'Property appears well maintained from the street. No major issues observed during this inspection.',
      created_at: property.created_at,
      submitted_at: submittedAt.toISOString(),
      properties: property,
      enrichment_status: 'none',
    };

    if (type === 'commercial') {
      survey.building_type = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
      survey.occupancy = occupancyTypes[Math.floor(Math.random() * occupancyTypes.length)];
      survey.zoning_type = 'Commercial-B1';
      survey.parking_avail = 'Surface Lot';
    }

    surveys.push(survey);
  }

  return { properties, surveys };
};
