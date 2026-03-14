import { safeFetch } from './SafeFetch';
import type { NominatimResult } from './Nominatim';
export type { NominatimResult };

interface PhotonFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: {
    osm_id: number;
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

interface PhotonResponse {
  features: PhotonFeature[];
}

function toDisplayName(p: PhotonFeature['properties']): string {
  return [
    p.name,
    p.housenumber ? `${p.street} ${p.housenumber}` : p.street,
    p.city,
    p.state,
    p.country,
  ]
    .filter(Boolean)
    .join(', ');
}

function toResult(f: PhotonFeature): NominatimResult {
  const [lon, lat] = f.geometry.coordinates;
  return {
    place_id: f.properties.osm_id,
    display_name: toDisplayName(f.properties),
    lat: String(lat),
    lon: String(lon),
  };
}

export function searchPlaces(query: string, near?: { lat: number; lon: number }) {
  const params = new URLSearchParams({ q: query, limit: '5', lang: 'en' });
  if (near) {
    params.set('lat', String(near.lat));
    params.set('lon', String(near.lon));
  }
  return safeFetch<NominatimResult[]>(() =>
    fetch(`https://photon.komoot.io/api/?${params}`)
      .then((res) => res.json())
      .then((data: PhotonResponse) => data.features.map(toResult))
  );
}

export function reverseGeocode(lon: number, lat: number) {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon), lang: 'en' });
  return safeFetch<NominatimResult>(() =>
    fetch(`https://photon.komoot.io/reverse?${params}`)
      .then((res) => res.json())
      .then((data: PhotonResponse) => {
        const f = data.features[0];
        if (!f) throw new Error('No results');
        return toResult(f);
      })
  );
}
