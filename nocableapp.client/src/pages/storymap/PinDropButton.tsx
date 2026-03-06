import VectorSource from "ol/source/Vector";
import React from "react";
import { GeoAltFill } from "react-bootstrap-icons";

interface Props {
    active: boolean;
    pinLayerSource: VectorSource
    onClick: () => void;
}

const PinDropButton: React.FC<Props> = ({ active, onClick }) => (
    <button
        onClick={onClick}
        title={active ? "Cancel Pin" : "Drop Pin"}
        style={{ padding: "8px 10px", ...(active ? { background: "#0d6efd", color: "white" } : {}) }}
    >
        <GeoAltFill size={22} />
    </button>
);

export default PinDropButton;
