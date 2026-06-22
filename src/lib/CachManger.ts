// Simple in-memory cache
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default async function fetchWithCache(key: string, url: string) {
  const cached = apiCache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  
  const response = await fetch(url);
  const data = await response.json();
  
  const results = data || [];

  apiCache.set(key, {
    data: results,
    timestamp: Date.now(),
  });

  return results;
}