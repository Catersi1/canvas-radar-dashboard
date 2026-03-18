import { GoogleGenAI } from "@google/genai";

export async function findPropertyPhoto(address: string, lat?: number, lng?: number) {
  const apiKey = process.env.GEMINI_API_KEY || 
                 (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                 (import.meta as any).env?.GEMINI_API_KEY || 
                 '';
  
  if (!apiKey || apiKey === 'undefined') {
    console.error("CRITICAL: GEMINI_API_KEY is missing or undefined. Photo search will fail.");
    return { imageUrl: '' };
  }

  // Masked key for logging
  const maskedKey = apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4);
  console.log(`[Photo Search] Using API Key: ${maskedKey}`);

  const ai = new GoogleGenAI({ apiKey });

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

    console.log(`[Photo Search] Calling Gemini API for address: ${address}`);
    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
        },
      });
    } catch (toolError: any) {
      console.warn("[Photo Search] Primary call failed (likely tool or quota issue). Retrying without tools...", toolError.message || toolError);
      try {
        response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt + "\n\nNote: If you cannot search the web, provide your best guess for a public image URL or a placeholder from a known service.",
          config: {
            responseMimeType: "application/json",
          },
        });
      } catch (retryError: any) {
        console.error("[Photo Search] Retry call also failed:", retryError.message || retryError);
        throw retryError;
      }
    }

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
