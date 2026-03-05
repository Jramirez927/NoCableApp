import React from "react";
import { Search } from "react-bootstrap-icons";

interface Props {
    open: boolean;
    onToggle: () => void;
}

const LocationSearchToggle: React.FC<Props> = ({ open, onToggle }) => (
    <button
        onClick={onToggle}
        title={open ? "Close Search" : "Search Location"}
        style={{ padding: "8px 10px", ...(open ? { background: "#0d6efd", color: "white" } : {}) }}
    >
        <Search size={22} />
    </button>
);

export default LocationSearchToggle;
