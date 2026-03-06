import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Overlay from "ol/Overlay";
import { MapUtils } from "../../utils/MapUtils";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import LocationSearch, {
  NominatimResult,
} from "../../components/LocationSearch/LocationSearch";
import LocationSearchToggle from "./LocationSearchToggle";
import AddJournalEntryButton from "./AddJournalEntryButton";
import JournalEntryForm from "./JournalEntryForm";
import PinDropButton from "./PinDropButton";
import {
  createJournalEntry,
  getJournalEntries,
  JournalEntry,
} from "../../api/journalEntries";
import { reverseGeocode } from "../../api/nominatim";
import { useMap } from "../../contexts/MapProvider";
import { fromLonLat, toLonLat } from "ol/proj";
import JournalEntryPopup from "./JournalEntryPopup";

const placeCoords = (place: NominatimResult) =>
  fromLonLat([parseFloat(place.lon), parseFloat(place.lat)]);

const pinStyle = MapUtils.createPinIconStyle();

const entryStyle = MapUtils.createEntryStyle("#f3250e", 0.2);

const StoryMap: React.FC = () => {
  const { map, mapDivRef } = useMap();
  const [selectedPlace, setSelectedPlace] = useState<NominatimResult | null>(
    null,
  );
  const [userLocation, setUserLocation] = useState<
    { lat: number; lon: number } | undefined
  >();
  const [popupEntryView, setPopupEntryView] = useState<JournalEntry | null>(
    null,
  );

  const [searchOpen, setSearchOpen] = useState(false);
  const [journalFormOpen, setJournalFormOpen] = useState(false);

  const placementModeRef = useRef(false);
  const pinSource = useRef(new VectorSource());
  const pinLayer = useRef(
    new VectorLayer({ source: pinSource.current, style: pinStyle }),
  );

  const journalEntriesSource = useRef(new VectorSource());
  const journalEntriesLayer = useRef(
    new VectorLayer({
      source: journalEntriesSource.current,
      style: entryStyle,
    }),
  );
  const overlayEl = useRef(document.createElement("div"));
  const overlayRef = useRef<Overlay | null>(null);

  const loadEntries = useCallback(async () => {
    const { data } = await getJournalEntries();
    if (!data) return;
    journalEntriesSource.current.clear();
    data.forEach((entry) => {
      const feature = new Feature(
        new Point(fromLonLat([entry.longitude, entry.latitude])),
      );
      feature.setProperties(entry);
      journalEntriesSource.current.addFeature(feature);
    });
  }, []);

  useEffect(() => {
    if (!map) return;
    const overlay = new Overlay({
      element: overlayEl.current,
      positioning: "bottom-center",
      stopEvent: true,
    });
    map.addOverlay(overlay);
    overlayRef.current = overlay;
    map.addLayer(journalEntriesLayer.current);
    map.addLayer(pinLayer.current);
    loadEntries();

    navigator.geolocation?.getCurrentPosition(({ coords }) => {
      MapUtils.navigateToCoords(map, coords.longitude, coords.latitude, {
        zoom: 13,
      });
      setUserLocation({ lat: coords.latitude, lon: coords.longitude });
    });

    const handleClick = async (e: { pixel: [number, number] }) => {
      if (
        placementModeRef.current &&
        pinSource.current.getFeatures().length === 0
      ) {
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
        if (layer === journalEntriesLayer.current) {
          const entry = feature.getProperties() as JournalEntry;
          const coord = (feature.getGeometry() as Point).getCoordinates();
          setJournalFormOpen(false);
          overlay.setPosition(coord);
          setPopupEntryView(entry);
          return true;
        }
      });
      if (!hit) {
        overlay.setPosition(undefined);
        setPopupEntryView(null);
      }
    };

    map.on("click", handleClick as never);
    return () => {
      map.un("click", handleClick as never);
      map.removeOverlay(overlay);
      map.removeLayer(journalEntriesLayer.current);
      map.removeLayer(pinLayer.current);
    };
  }, [map, loadEntries]);

  const handleJournalFormToggle = () => {
    if (journalFormOpen) {
      overlayRef.current?.setPosition(undefined);
      setJournalFormOpen(false);
    } else {
      if (selectedPlace) {
        setPopupEntryView(null);
        overlayRef.current?.setPosition(placeCoords(selectedPlace));
      }
      setJournalFormOpen(true);
    }
  };

  const handlePinDropToggle = () => {
    if (placementModeRef.current) {
      placementModeRef.current = false;
      setSelectedPlace(null);
      pinSource.current.clear();
      map!.getTargetElement().style.cursor = "";
    } else {
      placementModeRef.current = true;
      map!.getTargetElement().style.cursor = `url('${MapUtils.pinSvgDataUrl("#2b09ee", 30)}') 15 30, crosshair`;
    }
  };

  const handlePlaceSelect = (place: NominatimResult) => {
    placementModeRef.current = true;
    map!.getTargetElement().style.cursor = "";
    setSelectedPlace(place);
    setSearchOpen(false);
    const coords = placeCoords(place);
    MapUtils.navigateToCoords(
      map!,
      parseFloat(place.lon),
      parseFloat(place.lat),
      { zoom: 20 },
      () => {
        pinSource.current.clear();
        pinSource.current.addFeature(new Feature(new Point(coords)));
      },
    );
  };

  const handleCreateEntry = async (formData: {
    title: string;
    body: string;
    dateVisited: string;
  }) => {
    if (!selectedPlace) return;

    await createJournalEntry({
      title: formData.title,
      body: formData.body,
      placeName: selectedPlace.display_name,
      latitude: parseFloat(selectedPlace.lat),
      longitude: parseFloat(selectedPlace.lon),
      dateVisited: formData.dateVisited,
    });

    placementModeRef.current = false;
    map!.getTargetElement().style.cursor = "";
    setSelectedPlace(null);
    pinSource.current.clear();
    overlayRef.current?.setPosition(undefined);
    setJournalFormOpen(false);
    loadEntries();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <div style={{ position: "relative", flex: 1, width: "100%" }}>
        <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />
        {searchOpen && (
          <div
            style={{
              position: "absolute",
              top: "55%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
            }}
          >
            <LocationSearch onSelect={handlePlaceSelect} near={userLocation} />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            zIndex: 1000,
          }}
        >
          <LocationSearchToggle
            open={searchOpen}
            onToggle={() => setSearchOpen((p) => !p)}
          />
          {selectedPlace && (
            <AddJournalEntryButton
              open={journalFormOpen}
              onToggle={handleJournalFormToggle}
            />
          )}
          <PinDropButton
            active={!!selectedPlace}
            onClick={handlePinDropToggle}
            pinLayerSource={pinSource.current}
          />
        </div>
      </div>
      {createPortal(
        journalFormOpen && selectedPlace ? (
          <JournalEntryForm
            placeName={selectedPlace.display_name}
            onSubmit={handleCreateEntry}
            onCancel={() => {
              overlayRef.current?.setPosition(undefined);
              setJournalFormOpen(false);
            }}
          />
        ) : popupEntryView ? (
          <JournalEntryPopup
            entry={popupEntryView}
            onClose={() => {
              overlayRef.current?.setPosition(undefined);
              setPopupEntryView(null);
            }}
          />
        ) : null,
        overlayEl.current,
      )}
    </div>
  );
};

export default StoryMap;
