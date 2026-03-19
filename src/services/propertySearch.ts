import { GoogleGenAI } from "@google/genai";

export async function findPropertyPhoto(address: string, lat?: number, lng?: number, skipMaps: boolean = false) {
  const rawApiKey = process.env.GEMINI_API_KEY || 
                   process.env.VITE_GEMINI_API_KEY ||
                   (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                   (import.meta as any).env?.GEMINI_API_KEY || 
                   '';
  
  const mapsApiKey = process.env.GOOGLE_MAPS_PLATFORM_KEY || 
                    (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || 
                    '';

  // Clean up the key in case it's the string "undefined" or "null"
  const apiKey = (rawApiKey && rawApiKey !== 'undefined' && rawApiKey !== 'null' && rawApiKey.trim() !== '') ? rawApiKey.trim() : '';
  const gmapsKey = (mapsApiKey && mapsApiKey !== 'undefined' && mapsApiKey !== 'null' && mapsApiKey.trim() !== '') ? mapsApiKey.trim() : '';
  
  // If we have a Google Maps key, we can use the Street View Static API directly
  if (gmapsKey && !skipMaps) {
    console.log(`[Photo Search] Using Google Maps Street View Static API for: ${address}`);
    const baseUrl = "https://maps.googleapis.com/maps/api/streetview";
    const params = new URLSearchParams({
      size: "1200x800",
      location: address,
      key: gmapsKey,
      fov: "90",
      heading: "0",
      pitch: "0",
      radius: "50", // Search within 50 meters for a panorama
      source: "outdoor" // Prefer outdoor panoramas
    });
    
    // If we have lat/lng, use them for better accuracy
    if (lat && lng) {
      params.set("location", `${lat},${lng}`);
    }

    return {
      imageUrl: `${baseUrl}?${params.toString()}`,
      sourceUrl: `https://www.google.com/maps/search/${encodeURIComponent(address)}`,
      description: "Google Street View image",
      groundingChunks: []
    };
  }

  if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY is missing or invalid. Photo search will fail. Please ensure you have set GEMINI_API_KEY in your AI Studio Secrets.");
    return { imageUrl: `https://picsum.photos/seed/${address.replace(/\s/g, '')}/1200/800` };
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
        let errorMsg = retryError.message || "API Call Failed";
        if (errorMsg.includes("403") || errorMsg.includes("PERMISSION_DENIED")) {
          errorMsg = "Gemini API Permission Denied. Please check if your API key is valid.";
        } else if (errorMsg.includes("429")) {
          errorMsg = "Gemini API Quota Exceeded. Please try again later.";
        }
        throw new Error(errorMsg);
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
