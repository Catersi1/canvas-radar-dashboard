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

  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                 (import.meta as any).env?.GEMINI_API_KEY || 
                 process.env.GEMINI_API_KEY || 
                 '';
  
  if (!apiKey || apiKey === 'undefined') {
    console.error("CRITICAL: GEMINI_API_KEY is missing or undefined. Enrichment will fail.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  console.log(`[Enrichment] Processing address: "${address}"`);

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
    
    Return the result as a JSON object matching the requested schema. If you cannot find exact data for this specific address, provide realistic estimates based on the neighborhood and similar properties in ${address.split(',').slice(1).join(',').trim()}.`;

    console.log("[Enrichment] Calling Gemini API (Primary: with Search)...");
    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are a property data enrichment expert. Your goal is to find accurate real estate information and local amenities for a given address. Always return data in the requested JSON format. If specific data points are unavailable, provide your best estimate based on the neighborhood, but ensure the JSON structure is valid and all fields are present.",
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
    } catch (toolError: any) {
      console.warn("[Enrichment] Primary call failed (likely tool or quota issue). Retrying without tools...", toolError.message || toolError);
      response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt + "\n\nNote: If you cannot search the web, provide realistic estimates based on your internal knowledge of the area and neighborhood.",
        config: {
          systemInstruction: "You are a property data enrichment expert. Return JSON data. Use your internal knowledge to provide the best possible estimates for the area if search is unavailable.",
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

    console.log("[Enrichment] Response received from Gemini.");
    let text = response.text;
    if (!text) {
      console.warn("[Enrichment] Empty response text from Gemini.");
      return null;
    }

    // Clean up text in case it has markdown backticks or other noise
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    } else {
      text = text.replace(/```json\n?/, '').replace(/```\n?$/, '').trim();
    }

    try {
      const result = JSON.parse(text);
      console.log("[Enrichment] Successfully parsed JSON result.");
      return result;
    } catch (parseError) {
      console.error("[Enrichment] JSON Parse Error. Raw text:", text);
      // Try one more time with a more aggressive cleanup if it looks like it has text around it
      try {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}') + 1;
        if (start >= 0 && end > start) {
          const cleaned = text.substring(start, end);
          return JSON.parse(cleaned);
        }
      } catch (innerError) {
        console.error("[Enrichment] Aggressive JSON Parse Error:", innerError);
      }
      return null;
    }
  } catch (error: any) {
    console.error("[Enrichment] Fatal Error:", error.message || error);
    return null;
  }
}
