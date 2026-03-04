import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import "ol/ol.css";
import PlaceSearch, { NominatimResult } from "./PlaceSearch";
import JournalEntryForm from "./JournalEntryForm";
import { createJournalEntry, getJournalEntries, JournalEntry } from "../../api/journalEntries";

const pinStyle = new Style({
    image: new CircleStyle({
        radius: 8,
        fill: new Fill({ color: "#e74c3c" }),
        stroke: new Stroke({ color: "#fff", width: 2 }),
    }),
});

const StoryMap: React.FC = () => {
    const { user } = useAuth();
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<Map | null>(null);
    const vectorSourceRef = useRef(new VectorSource());
    const [selectedPlace, setSelectedPlace] = useState<NominatimResult | null>(null);
    const [showForm, setShowForm] = useState(false);

    const loadEntries = useCallback(async () => {
        const { data } = await getJournalEntries();
        if (!data) return;

        vectorSourceRef.current.clear();
        data.forEach((entry: JournalEntry) => {
            const feature = new Feature({
                geometry: new Point(fromLonLat([entry.longitude, entry.latitude])),
                entry,
            });
            vectorSourceRef.current.addFeature(feature);
        });
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({ source: new OSM() }),
                new VectorLayer({ source: vectorSourceRef.current, style: pinStyle }),
            ],
            view: new View({ center: [0, 0], zoom: 2 }),
        });

        mapInstanceRef.current = map;
        loadEntries();

        return () => map.setTarget(undefined);
    }, [loadEntries]);

    const handlePlaceSelect = (place: NominatimResult) => {
        setSelectedPlace(place);
        mapInstanceRef.current?.getView().animate({
            center: fromLonLat([parseFloat(place.lon), parseFloat(place.lat)]),
            zoom: 14,
            duration: 800,
        });
    };

    const handleCreateEntry = async (formData: { title: string; body: string; dateVisited: string }) => {
        if (!selectedPlace) return;

        await createJournalEntry({
            title: formData.title,
            body: formData.body,
            placeName: selectedPlace.display_name,
            latitude: parseFloat(selectedPlace.lat),
            longitude: parseFloat(selectedPlace.lon),
            dateVisited: formData.dateVisited,
        });

        setShowForm(false);
        setSelectedPlace(null);
        loadEntries();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" , width: "100%"}}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "#201040", borderBottom: "1px solid #ddd" }}>
                <PlaceSearch onSelect={handlePlaceSelect} />
            </div>
            <div ref={mapDivRef} style={{ width: "100%", height: "100%" }}></div>;

            {showForm && selectedPlace && (
                <JournalEntryForm
                    place={selectedPlace}
                    onSubmit={handleCreateEntry}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default StoryMap;