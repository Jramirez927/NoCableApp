import React, { useCallback, useEffect, useRef, useState } from "react";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import PlaceSearch, { NominatimResult } from "./PlaceSearch";
import JournalEntryForm from "./JournalEntryForm";
import { createJournalEntry, getJournalEntries } from "../../api/journalEntries";
import { useMap } from "../../contexts/MapProvider";
import { fromLonLat } from "ol/proj";

const pinStyle = new Style({
    image: new CircleStyle({
        radius: 7,
        fill: new Fill({ color: "#e74c3c" }),
        stroke: new Stroke({ color: "#000000", width: 3 }),
    }),
});

const StoryMap: React.FC = () => {
    const { map, mapDivRef } = useMap();
    const [selectedPlace, setSelectedPlace] = useState<NominatimResult | null>(null);
    const [showForm, setShowForm] = useState(true);
    const pinSource = useRef(new VectorSource());
    const pinLayer = useRef(new VectorLayer({ source: pinSource.current, style: pinStyle }));

    useEffect(() => {
        if (!map) return;
        map.addLayer(pinLayer.current);
        return () => { map.removeLayer(pinLayer.current); };
    }, [map]);

    const loadEntries = useCallback(async () => {
        const { data } = await getJournalEntries();
        if (!data) return;

    }, []);


    const handlePlaceSelect = (place: NominatimResult) => {
        setSelectedPlace(place);
        // navigate to point then add point feature
        const coords = fromLonLat([parseFloat(place.lon), parseFloat(place.lat)]);
        map?.getView().animate({ center: coords, zoom: 20, duration: 800 }, () => {
            pinSource.current.clear();
            pinSource.current.addFeature(new Feature(new Point(coords)));
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