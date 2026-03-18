import { GoogleGenAI } from "@google/genai";

const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || (import.meta as any).env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export async function findPropertyPhoto(address: string, lat?: number, lng?: number) {
  try {
    const prompt = `Find a direct, public image URL for the property at: ${address}. 
    Coordinates: ${lat}, ${lng}. 
    Search for real estate listings (Zillow, Redfin, Realtor.com) or Google Street View images.
    
    CRITICAL: I need a direct link to an image file (ending in .jpg, .png, etc.) that can be displayed in an <img> tag.
    If you find a Street View page, try to find the static image URL.
    
    Return the result as a JSON object:
    {
      "imageUrl": "DIRECT_IMAGE_URL",
      "sourceUrl": "PAGE_WHERE_IMAGE_WAS_FOUND",
      "description": "Brief description of the photo"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    let text = response.text || '{}';
    // Clean up text in case it has markdown backticks or other noise
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }
    
    const result = JSON.parse(text);
    
    // Validate if it's a real URL or just a placeholder string
    const isValidUrl = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    return {
      imageUrl: isValidUrl(result.imageUrl) ? result.imageUrl : `https://picsum.photos/seed/${address.replace(/\s/g, '')}/1200/800`,
      sourceUrl: isValidUrl(result.sourceUrl) ? result.sourceUrl : `https://www.google.com/maps/search/${encodeURIComponent(address)}`,
      description: result.description || "Property photo",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Error finding property photo:", error);
    // Fallback to a placeholder
    return {
      imageUrl: `https://picsum.photos/seed/${address.replace(/\s/g, '')}/1200/800`,
      sourceUrl: `https://www.google.com/maps/search/${encodeURIComponent(address)}`,
      groundingChunks: []
    };
  }
}
