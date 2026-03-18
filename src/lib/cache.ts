const CACHE_KEY = 'property_enrichment_cache';

export const saveToCache = (id: string, data: any) => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[id] = {
      ...cache[id],
      ...data,
      cached_at: new Date().toISOString()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Cache save failed:', e);
  }
};

export const getFromCache = (id: string) => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    return cache[id] || null;
  } catch (e) {
    console.error('Cache get failed:', e);
    return null;
  }
};

export const clearCache = () => {
  localStorage.removeItem(CACHE_KEY);
};
