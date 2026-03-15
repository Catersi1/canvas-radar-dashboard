import { GoogleGenAI, Type } from "@google/genai";

export interface EnrichedPropertyData {
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
  source_url?: string;
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
}

export async function enrichPropertyData(address: string): Promise<EnrichedPropertyData | null> {
  if (!address || address.trim() === '') {
    console.warn("Empty address provided for enrichment.");
    return null;
  }

  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
                 (import.meta as any).env?.GEMINI_API_KEY || 
                 (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                 '';
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing. Please set it in the environment variables.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  console.log(`Starting enrichment for: ${address}`);
  console.log("Using API Key:", apiKey ? "Present (starts with " + apiKey.substring(0, 4) + ")" : "MISSING");

  try {
    const prompt = `Search for detailed property information and nearby amenities for the address: ${address}. 
    I need to find:
    1. Property data: square footage, year built, last sale price, last sale date, lot size, bedrooms, bathrooms, property tax, and estimated current value.
    2. Nearby amenities: 
       - Closest largest grocery store
       - Closest highway
       - Closest elementary school
       - Closest middle school
       - Closest high school
       - Closest gas station
       - Closest Walmart
       - Closest restaurant
    For each amenity, provide the name, driving distance (e.g., "5 mins"), and distance in miles.
    3. General safety of the area (rating like "Safe", "Very Safe", "Moderate" and a brief note).
    
    Return the result as a JSON object with the following structure:
    {
      "sqft": number,
      "year_built": number,
      "last_sale_price": number,
      "last_sale_date": string,
      "lot_size": string,
      "bedrooms": number,
      "bathrooms": number,
      "property_tax": number,
      "estimated_value": number,
      "neighborhood_rating": string,
      "source_url": string,
      "closest_grocery": { "name": string, "distance": string, "miles": number },
      "closest_highway": { "name": string, "distance": string, "miles": number },
      "closest_elementary": { "name": string, "distance": string, "miles": number },
      "closest_middle": { "name": string, "distance": string, "miles": number },
      "closest_high": { "name": string, "distance": string, "miles": number },
      "closest_gas": { "name": string, "distance": string, "miles": number },
      "closest_walmart": { "name": string, "distance": string, "miles": number },
      "closest_restaurant": { "name": string, "distance": string, "miles": number },
      "safety_rating": string,
      "safety_notes": string
    }`;

    console.log("Calling Gemini API with gemini-2.5-flash...");
    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sqft: { type: Type.NUMBER },
              year_built: { type: Type.NUMBER },
              last_sale_price: { type: Type.NUMBER },
              last_sale_date: { type: Type.STRING },
              lot_size: { type: Type.STRING },
              bedrooms: { type: Type.NUMBER },
              bathrooms: { type: Type.NUMBER },
              property_tax: { type: Type.NUMBER },
              estimated_value: { type: Type.NUMBER },
              neighborhood_rating: { type: Type.STRING },
              source_url: { type: Type.STRING },
              closest_grocery: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              closest_highway: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              closest_elementary: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              closest_middle: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              closest_high: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              closest_gas: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              closest_walmart: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              closest_restaurant: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              safety_rating: { type: Type.STRING },
              safety_notes: { type: Type.STRING },
            },
          },
        },
      });
    } catch (toolError) {
      console.warn("Gemini with googleSearch failed, retrying without tools...", toolError);
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt + "\n\nNote: If you cannot search the web, provide realistic estimates based on your internal knowledge of the area.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sqft: { type: Type.NUMBER },
              year_built: { type: Type.NUMBER },
              last_sale_price: { type: Type.NUMBER },
              last_sale_date: { type: Type.STRING },
              lot_size: { type: Type.STRING },
              bedrooms: { type: Type.NUMBER },
              bathrooms: { type: Type.NUMBER },
              property_tax: { type: Type.NUMBER },
              estimated_value: { type: Type.NUMBER },
              neighborhood_rating: { type: Type.STRING },
              source_url: { type: Type.STRING },
              closest_grocery: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              closest_highway: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              closest_elementary: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              closest_middle: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              closest_high: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              closest_gas: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              closest_walmart: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              closest_restaurant: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, miles: { type: Type.NUMBER } }
              },
              safety_rating: { type: Type.STRING },
              safety_notes: { type: Type.STRING },
            },
          },
        },
      });
    }

    console.log("Gemini API response received.");
    const text = response.text;
    if (!text) {
      console.warn("No text returned from Gemini for enrichment. Response object:", response);
      return null;
    }

    try {
      const result = JSON.parse(text);
      console.log("Enrichment successful:", result);
      return result;
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON. Text:", text, "Error:", parseError);
      return null;
    }
  } catch (error: any) {
    console.error("Error enriching property data:", error);
    if (error.message) console.error("Error message:", error.message);
    if (error.stack) console.error("Error stack:", error.stack);
    return null;
  }
}
