import React, { useEffect, useRef, useState } from "react";
import styles from "./Storymap.module.css";
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
import AddPinButton from "./AddPinButton";
import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
  JournalEntry,
} from "../../api/journalEntries";

import { useMap } from "../../contexts/MapProvider";
import { fromLonLat, toLonLat } from "ol/proj";
import JournalEntryPopup from "./JournalEntryPopup";
import StorymapSidebar from "./StorymapSidebar";
import StorymapIconNavbar from "./StorymapIconNavbar";
import StorymapFeedPanel from "./StorymapFeedPanel";
import StorymapFriendsPanel from "./StorymapFriendsPanel";
import { Coordinate } from "ol/coordinate";
import { reverseGeocode } from "../../api/photon";

const pinStyle = MapUtils.createPinIconStyle();

const entryStyle = MapUtils.createEntryStyle("#f3250e", 0.2);

const StoryMap: React.FC = () => {
  const { map, mapDivRef } = useMap();
  const [userLocation, setUserLocation] = useState<
    { lat: number; lon: number } | undefined
  >();
  const [selectedJournalEntry, setSelectedJournalEntry] =
    useState<JournalEntry | null>(null);
  const [locationSearchOpen, setLocationSearchOpen] = useState(false);
  const [journalFormOpen, setJournalFormOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<"entries" | "feed" | "friends" | null>(null);

  const [selectedPlace, setSelectedPlace] = useState<Coordinate | null>(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState<string>("");
  const selectedPlaceSource = useRef(new VectorSource());
  const selectedPlaceLayer = useRef(
    new VectorLayer({ source: selectedPlaceSource.current, style: pinStyle }),
  );

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const journalEntriesSource = useRef(new VectorSource());
  const journalEntriesLayer = useRef(
    new VectorLayer({
      source: journalEntriesSource.current,
      style: entryStyle,
    }),
  );

  const popupOverlayEl = useRef(document.createElement("div"));
  const popupOverlayRef = useRef<Overlay | null>(null);

  // update Journal Entry Points on map
  useEffect(() => {
    journalEntriesSource.current.clear();
    journalEntries.forEach((entry) => {
      const feature = new Feature(
        new Point(fromLonLat([entry.longitude, entry.latitude])),
      );
      feature.setProperties(entry);
      journalEntriesSource.current.addFeature(feature);
    });
  }, [journalEntries]);
  //update selected location after every selectedPlace change
  useEffect(() => {
    if (!selectedPlace) {
      setSelectedPlaceName("");
      selectedPlaceSource.current.clear();
      return;
    }
    // navigate to pin after selection
    MapUtils.navigateToCoords(map!, selectedPlace, { zoom: 19 }, () => {
      selectedPlaceSource.current.clear();
      selectedPlaceSource.current.addFeature(
        new Feature(new Point(selectedPlace)),
      );
    });

    const [lon, lat] = toLonLat(selectedPlace);
    reverseGeocode(lon, lat).then(({ data }) => {
      if (data) setSelectedPlaceName(data.display_name);
    });
  }, [selectedPlace]);

  useEffect(() => {
    if (!map) return;
    const overlay = new Overlay({
      element: popupOverlayEl.current,
      positioning: "bottom-center",
      stopEvent: true,
      autoPan: true, 
    });
    map.addOverlay(overlay);
    popupOverlayRef.current = overlay;

    map.addLayer(journalEntriesLayer.current);
    map.addLayer(selectedPlaceLayer.current);

    getJournalEntries().then(({ data }) => {
      if (data) setJournalEntries(data);
    });

    navigator.geolocation?.getCurrentPosition(({ coords }) => {
      MapUtils.navigateToCoords(
        map,
        fromLonLat([coords.longitude, coords.latitude]),
        {
          zoom: 13,
        },
      );
      setUserLocation({ lat: coords.latitude, lon: coords.longitude });
    });

    const handleClick = async (e: { pixel: [number, number] }) => {
      const hit = map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
        if (layer === journalEntriesLayer.current) {
          const entry = feature.getProperties() as JournalEntry;
          const coord = (feature.getGeometry() as Point).getCoordinates();
          setJournalFormOpen(false);
          overlay.setPosition(coord);
          setSelectedJournalEntry(entry);
          return true;
        }
      });
      if (!hit) {
        overlay.setPosition(undefined);
        setSelectedJournalEntry(null);
      }
    };

    map.on("click", handleClick as never);
    return () => {
      map.un("click", handleClick as never);
      map.removeOverlay(overlay);
      map.removeLayer(journalEntriesLayer.current);
      map.removeLayer(selectedPlaceLayer.current);
    };
  }, [map]);

  const handleJournalFormToggle = () => {
    if (journalFormOpen) {
      popupOverlayRef.current?.setPosition(undefined);
      setJournalFormOpen(false);
    } else {
      if (selectedPlace) {
        const [lon, lat] = toLonLat(selectedPlace);
        setSelectedJournalEntry(null);
        popupOverlayRef.current?.setPosition(fromLonLat([lon, lat]));
      }
      setJournalFormOpen(true);
    }
  };

  const handleLocationSearchResult = (place: NominatimResult) => {
    map!.getTargetElement().style.cursor = "";
    setSelectedPlace(
      fromLonLat([parseFloat(place.lon), parseFloat(place.lat)]),
    );
    setSelectedPlaceName(place.display_name)
    setLocationSearchOpen(false);
  };

  const handleCreateEntry = async (formData: {
    title: string;
    body: string;
    dateVisited: string;
  }) => {
    if (!selectedPlace) return;

    const [lon, lat] = toLonLat(selectedPlace);
    const { data } = await createJournalEntry({
      title: formData.title,
      body: formData.body,
      placeName: selectedPlaceName,
      latitude: lat,
      longitude: lon,
      dateVisited: formData.dateVisited,
    });

    map!.getTargetElement().style.cursor = "";
    setSelectedPlace(null);
    popupOverlayRef.current?.setPosition(undefined);
    setJournalFormOpen(false);
    if (data) setJournalEntries((prev) => [...prev, data]);
  };

  const handleDeleteEntry = async (journalEntryId: number) => {
    const { error } = await deleteJournalEntry(journalEntryId);
    if (!error) {
      setJournalEntries((prev) => prev.filter((e) => e.id !== journalEntryId));
      setSelectedJournalEntry(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mapWrapper}>
        <div ref={mapDivRef} className={styles.mapDiv} />
        {locationSearchOpen && (
          <div className={styles.searchDropdown}>
            <LocationSearch
              onSelect={handleLocationSearchResult}
              near={userLocation}
            />
          </div>
        )}
        <div className={styles.bottomControls}>
          <LocationSearchToggle
            open={locationSearchOpen}
            onToggle={() => setLocationSearchOpen((p) => !p)}
          />
          {selectedPlace && (
            <AddJournalEntryButton
              open={journalFormOpen}
              onToggle={handleJournalFormToggle}
            />
          )}
          <AddPinButton
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
            selectedPlaceLayer={selectedPlaceLayer.current}
          />
        </div>
      </div>
      {activePanel === "friends" && (
        <div className={styles.sidePanel}>
          <StorymapFriendsPanel />
        </div>
      )}
      {activePanel === "feed" && (
        <div className={styles.sidePanel}>
          <StorymapFeedPanel />
        </div>
      )}
      {activePanel === "entries" && (
        <div className={styles.sidePanel}>
          <StorymapSidebar entries={journalEntries} />
        </div>
      )}
      <StorymapIconNavbar activePanel={activePanel} onToggle={setActivePanel} />
      {createPortal(
        journalFormOpen && selectedPlace ? (
          <JournalEntryForm
            placeName={selectedPlaceName}
            onSubmit={handleCreateEntry}
            onCancel={() => {
              popupOverlayRef.current?.setPosition(undefined);
              setJournalFormOpen(false);
            }}
          />
        ) : selectedJournalEntry ? (
          <JournalEntryPopup
            entry={selectedJournalEntry}
            onClose={() => {
              popupOverlayRef.current?.setPosition(undefined);
              setSelectedJournalEntry(null);
            }}
            onDelete={handleDeleteEntry}
          />
        ) : null,
        popupOverlayEl.current,
      )}
    </div>
  );
};

export default StoryMap;
