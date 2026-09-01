import axios from 'axios';

// ponytail: simple in-memory cache + 1 req/s throttle for Nominatim. Upgrade to Redis if scale hurts.
const cache = new Map<string, { value: string; expires: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;
let lastCallAt = 0;
let queue: Promise<void> = Promise.resolve();

async function throttle(): Promise<void> {
  const now = Date.now();
  const wait = Math.max(0, 1100 - (now - lastCallAt));
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastCallAt = Date.now();
}

function getCache(key: string): string | undefined {
  const e = cache.get(key);
  if (!e) return undefined;
  if (Date.now() > e.expires) { cache.delete(key); return undefined; }
  return e.value;
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const key = `rev:${lat.toFixed(5)},${lng.toFixed(5)}`;
  const cached = getCache(key);
  if (cached) return cached;
  let result = `${lat}, ${lng}`;
  const task = queue.then(async () => {
    await throttle();
    try {
      const r = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: { format: 'json', lat, lon: lng, addressdetails: 1 },
        headers: { 'User-Agent': 'NexoApp/1.0 (contact: dev@nexo.app)' },
        timeout: 5000,
      });
      result = r.data?.display_name || result;
    } catch { /* fallback */ }
  });
  queue = task.catch(() => {});
  await task;
  cache.set(key, { value: result, expires: Date.now() + CACHE_TTL_MS });
  return result;
}
