import React, { useRef, useState } from "react";
import { searchPlaces, type NominatimResult } from "../../api/nominatim";
import styles from "./LocationSearch.module.css";

export type { NominatimResult };

interface Props {
    onSelect: (result: NominatimResult) => void;
}

const LocationSearch: React.FC<Props> = ({ onSelect }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<NominatimResult[]>([]);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const search = (value: string) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!value.trim()) { setResults([]); return; }

        debounceRef.current = setTimeout(async () => {
            const { data, error } = await searchPlaces(value);
            if (error || !data) { console.error(error); return; }
            setResults(data);
        }, 250);
    };

    const handleSelect = (result: NominatimResult) => {
        setQuery(result.display_name);
        setResults([]);
        onSelect(result);
    };

    return (
        <div className={styles.wrapper}>
            <input
                className={styles.input}
                value={query}
                onChange={e => search(e.target.value)}
                placeholder="Search for a place..."
            />
            {results.length > 0 && (
                <ul className={styles.dropdown}>
                    {results.map(r => (
                        <li
                            key={r.place_id}
                            className={styles.option}
                            onClick={() => handleSelect(r)}
                        >
                            {r.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationSearch;
