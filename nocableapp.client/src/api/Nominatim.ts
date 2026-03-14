import { safeFetch } from './SafeFetch';

export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export function searchPlaces(query: string, near?: { lat: number; lon: number }) {
  const params = new URLSearchParams({ q: query, format: 'json', limit: '5' });
  if (near) {
    const delta = 10; // ~1000km bias radius
    params.set(
      'viewbox',
      `${near.lon - delta},${near.lat + delta},${near.lon + delta},${near.lat - delta}`
    );
    params.set('bounded', '0');
  }
  return safeFetch<NominatimResult[]>(() =>
    fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { 'Accept-Language': 'en' },
    }).then((res) => res.json())
  );
}

export function reverseGeocode(lon: number, lat: number) {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon), format: 'json' });
  return safeFetch<NominatimResult>(() =>
    fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
      headers: { 'Accept-Language': 'en' },
    }).then((res) => res.json())
  );
}
