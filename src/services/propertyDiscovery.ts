import { GoogleGenAI, Type } from "@google/genai";

export interface DiscoveredProperty {
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  type: 'residential' | 'commercial';
  description?: string;
}

export interface DiscoveryResult {
  properties: DiscoveredProperty[];
  error?: string;
}

export async function discoverProperties(location: string, criteria: string = "recent real estate listings"): Promise<DiscoveryResult> {
  const rawApiKey = process.env.GEMINI_API_KEY || 
                   process.env.VITE_GEMINI_API_KEY ||
                   (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                   (import.meta as any).env?.GEMINI_API_KEY || 
                   '';
  
  const apiKey = (rawApiKey && rawApiKey !== 'undefined' && rawApiKey !== 'null' && rawApiKey.trim() !== '') ? rawApiKey.trim() : '';
  
  if (!apiKey) {
    return { properties: [], error: "API Key Missing" };
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const prompt = `Find a list of property addresses in ${location} based on these criteria: ${criteria}. 
    I need real, specific addresses. 
    For each property, identify if it is residential or commercial.
    Provide approximate latitude and longitude for each property.
    Return the result as a JSON array of objects with these fields: address, city, state, zip, lat, lng, type, description.
    Limit the results to 5-10 high-quality properties.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a property discovery agent. Use Google Search to find actual property addresses and details in specific locations. Always return valid JSON.",
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            properties: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  address: { type: Type.STRING },
                  city: { type: Type.STRING },
                  state: { type: Type.STRING },
                  zip: { type: Type.STRING },
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER },
                  type: { type: Type.STRING, enum: ['residential', 'commercial'] },
                  description: { type: Type.STRING }
                },
                required: ['address', 'city', 'state', 'zip', 'lat', 'lng', 'type']
              }
            }
          }
        }
      },
    });

    let text = response.text;
    if (!text) return { properties: [], error: "Empty response from AI" };

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) text = jsonMatch[0];

    const result = JSON.parse(text);
    return { properties: result.properties || [] };
  } catch (error: any) {
    console.error("[Discovery] Error:", error);
    return { properties: [], error: error.message || "Discovery failed" };
  }
}
