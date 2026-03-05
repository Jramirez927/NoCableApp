import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Overlay from "ol/Overlay";
import { MapUtils } from "../../utils/MapUtils";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import LocationSearch, { NominatimResult } from "../../components/LocationSearch/LocationSearch";
import LocationSearchToggle from "./LocationSearchToggle";
import AddJournalEntryButton from "./AddJournalEntryButton";
import JournalEntryForm from "./JournalEntryForm";
import PinDropButton from "./PinDropButton";
import { createJournalEntry, getJournalEntries, JournalEntry } from "../../api/journalEntries";
import { reverseGeocode } from "../../api/nominatim";
import { useMap } from "../../contexts/MapProvider";
import { fromLonLat, toLonLat } from "ol/proj";
import JournalEntryPopup from "./JournalEntryPopup";

const pinStyle = MapUtils.createPinIconStyle();

const entryStyle = MapUtils.createEntryStyle('#f3250e', 0.2);

const StoryMap: React.FC = () => {
    const { map, mapDivRef } = useMap();
    const [selectedPlace, setSelectedPlace] = useState<NominatimResult | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | undefined>();
    const [popupEntry, setPopupEntry] = useState<JournalEntry | null>(null);
    const [placementMode, setPlacementMode] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [journalFormOpen, setJournalFormOpen] = useState(false);
    const placementModeRef = useRef(false);
    const pinSource = useRef(new VectorSource());
    const pinLayer = useRef(new VectorLayer({ source: pinSource.current, style: pinStyle }));
    const entriesSource = useRef(new VectorSource());
    const entriesLayer = useRef(new VectorLayer({ source: entriesSource.current, style: entryStyle }));
    const popupEl = useRef(document.createElement("div"));

    const overlayRef = useRef<Overlay | null>(null);

    const loadEntries = useCallback(async () => {
        const { data } = await getJournalEntries();
        if (!data) return;
        entriesSource.current.clear();
        data.forEach(entry => {
            const feature = new Feature(new Point(fromLonLat([entry.longitude, entry.latitude])));
            feature.setProperties(entry);
            entriesSource.current.addFeature(feature);
        });
    }, []);

    useEffect(() => {
        if (!map) return;

        const overlay = new Overlay({
            element: popupEl.current,
            positioning: "bottom-center",
            stopEvent: true,
        });
        map.addOverlay(overlay);
        overlayRef.current = overlay;

        map.addLayer(entriesLayer.current);
        map.addLayer(pinLayer.current);
        loadEntries();

        navigator.geolocation?.getCurrentPosition(({ coords }) => {
            MapUtils.navigateToCoords(map, coords.longitude, coords.latitude, { zoom: 13 });
            setUserLocation({ lat: coords.latitude, lon: coords.longitude });
        });

        const handleClick = async (e: { pixel: [number, number] }) => {
            if (placementModeRef.current && pinSource.current.getFeatures().length === 0) {
                const coord = map.getCoordinateFromPixel(e.pixel);
                const [lon, lat] = toLonLat(coord);
                const { data } = await reverseGeocode(lat, lon);
                if (data) {
                    handlePlaceSelect(data);
                    map.getTargetElement().style.cursor = "";
                }
                return;
            }

            const hit = map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
                if (layer === entriesLayer.current) {
                    const entry = feature.getProperties() as JournalEntry;
                    const coord = (feature.getGeometry() as Point).getCoordinates();
                    overlay.setPosition(coord);
                    setPopupEntry(entry);
                    return true;
                }
            });
            if (!hit) {
                overlay.setPosition(undefined);
                setPopupEntry(null);
            }
        };

        map.on("click", handleClick as never);
        return () => {
            map.un("click", handleClick as never);
            map.removeOverlay(overlay);
            map.removeLayer(entriesLayer.current);
            map.removeLayer(pinLayer.current);
        };
    }, [map, loadEntries]);


    const handlePinDropToggle = () => {
        if (placementModeRef.current) {
            placementModeRef.current = false;
            setPlacementMode(false);
            setSelectedPlace(null);
            pinSource.current.clear();
            map!.getTargetElement().style.cursor = "";
        } else {
            placementModeRef.current = true;
            setPlacementMode(true);
            map!.getTargetElement().style.cursor = "crosshair";
        }
    };

    const handlePlaceSelect = (place: NominatimResult) => {
        placementModeRef.current = true;
        setPlacementMode(true);
        setSelectedPlace(place);
        setSearchOpen(false);
        const coords = fromLonLat([parseFloat(place.lon), parseFloat(place.lat)]);
        MapUtils.navigateToCoords(map!, parseFloat(place.lon), parseFloat(place.lat), { zoom: 20 }, () => {
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

        setSelectedPlace(null);
        setJournalFormOpen(false);
        loadEntries();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
            <div style={{ position: "relative", flex: 1, width: "100%" }}>
                <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />
                {searchOpen && (
                    <div style={{ position: "absolute", top: "55%", left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}>
                        <LocationSearch onSelect={handlePlaceSelect} near={userLocation} />
                    </div>
                )}
                {journalFormOpen && selectedPlace && (
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1001 }}>
                        <JournalEntryForm
                            placeName={selectedPlace.display_name}
                            onSubmit={handleCreateEntry}
                            onCancel={() => setJournalFormOpen(false)}
                        />
                    </div>
                )}
                <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 1000 }}>
                    <LocationSearchToggle open={searchOpen} onToggle={() => setSearchOpen(p => !p)} />
                    {selectedPlace && <AddJournalEntryButton open={journalFormOpen} onToggle={() => setJournalFormOpen(p => !p)} />}
                    <PinDropButton active={placementMode} onClick={handlePinDropToggle} />
                </div>
                </div>
            {createPortal(
                popupEntry && (
                    <JournalEntryPopup
                        entry={popupEntry}
                        onClose={() => {
                            overlayRef.current?.setPosition(undefined);
                            setPopupEntry(null);
                        }}
                    />
                ),
                popupEl.current
            )}
        </div>
    );
};

export default StoryMap;