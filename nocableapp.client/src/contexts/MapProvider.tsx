import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

interface MapContextType {
    map: Map | null;
    mapDivRef: React.RefObject<HTMLDivElement | null>;
}

const MapContext = createContext<MapContextType | null>(null);

export function useMap() {
    const context = useContext(MapContext);
    if (!context) throw new Error("useMap must be used within a MapProvider");
    return context;
}

const MapProvider = ({ children }: { children: React.ReactNode }) => {
    const [map, setMap] = useState<Map | null>(null);
    const mapDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapDivRef.current) return;

        const instance = new Map({
            target: mapDivRef.current,
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
            ],
            view: new View({ center: [39.2, -76.6], zoom: 2 }),
            controls: [],
        });

        setMap(instance);

        return () => {
            instance.setTarget(undefined);
            setMap(null);
        };
    }, []);

    return (
        <MapContext.Provider value={{ map, mapDivRef }}>
            {children}
        </MapContext.Provider>
    );
};

export default MapProvider;
