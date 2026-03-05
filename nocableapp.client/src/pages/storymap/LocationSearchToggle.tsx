import React, { useState } from "react";
import LocationSearch, { NominatimResult } from "../../components/LocationSearch/LocationSearch";

interface Props {
    onSelect: (result: NominatimResult) => void;
    near?: { lat: number; lon: number };
}

const LocationSearchToggle: React.FC<Props> = ({ onSelect, near }) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (result: NominatimResult) => {
        onSelect(result);
        setOpen(false);
    };

    return (
        <>
            <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}>
                <button onClick={() => setOpen(prev => !prev)}>
                    Search Location
                </button>
            </div>
            {open && (
                <div style={{ position: "absolute", top:"24px", left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}>
                    <LocationSearch onSelect={handleSelect} near={near} />
                </div>
            )}
        </>
    );
};

export default LocationSearchToggle;
