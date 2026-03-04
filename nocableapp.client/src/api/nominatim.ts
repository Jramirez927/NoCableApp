import { safeFetch } from "./safeFetch";

export interface NominatimResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

export function searchPlaces(query: string) {
    return safeFetch<NominatimResult[]>(() =>
        //TODO convert this to async await pattern
        fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
            { headers: { "Accept-Language": "en" } }
        ).then(res => res.json())
    );
}
