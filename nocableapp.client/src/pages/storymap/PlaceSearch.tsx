import React, { useRef, useState } from "react";

export interface NominatimResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

interface Props {
    onSelect: (result: NominatimResult) => void;
}

const PlaceSearch: React.FC<Props> = ({ onSelect }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<NominatimResult[]>([]);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const search = (value: string) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!value.trim()) { setResults([]); return; }

        debounceRef.current = setTimeout(async () => {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5`,
                { headers: { "Accept-Language": "en" } }
            );
            const data: NominatimResult[] = await res.json();
            setResults(data);
        }, 400);
    };

    const handleSelect = (result: NominatimResult) => {
        setQuery(result.display_name);
        setResults([]);
        onSelect(result);
    };

    return (
        <div style={{ position: "relative" }}>
            <input
                value={query}
                onChange={e => search(e.target.value)}
                placeholder="Search for a place..."
                style={{ width: "300px", padding: "8px", fontSize: "14px" }}
            />
            {results.length > 0 && (
                <ul style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "400px",
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    zIndex: 1000,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}>
                    {results.map(r => (
                        <li
                            key={r.place_id}
                            onClick={() => handleSelect(r)}
                            style={{
                                padding: "8px 12px",
                                cursor: "pointer",
                                fontSize: "13px",
                                borderBottom: "1px solid #eee",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")}
                            onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                        >
                            {r.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PlaceSearch;