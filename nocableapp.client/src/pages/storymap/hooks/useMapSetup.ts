import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import VectorLayer from 'ol/layer/Vector';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { MapUtils } from '../../../utils/MapUtils';
import { JournalEntry, FeedEntry } from '../../../api/JournalEntries';

interface UseMapSetupOptions {
  journalEntriesLayer: VectorLayer;
  feedEntriesLayer: VectorLayer;
  selectedPlaceLayer: VectorLayer;
  onEntryClick: (entry: JournalEntry | FeedEntry) => void;
  onEmptyClick: () => void;
  onLoad: () => void;
}

export function useMapSetup(map: Map | null, options: UseMapSetupOptions) {
  const popupOverlayEl = useRef(document.createElement('div'));
  const popupOverlay = useRef<Overlay | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | undefined>();

  // Keep a ref to options so the click handler always sees the latest callbacks
  // without needing to re-register the listener on every render.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!map) return;

    const overlay = new Overlay({
      element: popupOverlayEl.current,
      positioning: 'bottom-center',
      stopEvent: true,
      autoPan: true,
    });
    map.addOverlay(overlay);
    popupOverlay.current = overlay;

    map.addLayer(optionsRef.current.feedEntriesLayer);
    map.addLayer(optionsRef.current.journalEntriesLayer);
    map.addLayer(optionsRef.current.selectedPlaceLayer);

    optionsRef.current.onLoad();

    navigator.geolocation?.getCurrentPosition(({ coords }) => {
      MapUtils.navigateToCoords(map, fromLonLat([coords.longitude, coords.latitude]), {
        zoom: 13,
      });
      setUserLocation({ lat: coords.latitude, lon: coords.longitude });
    });

    const handleClick = (e: { pixel: [number, number] }) => {
      const { journalEntriesLayer, feedEntriesLayer } = optionsRef.current;
      const hit = map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
        if (layer === journalEntriesLayer || layer === feedEntriesLayer) {
          const entry = feature.getProperties() as JournalEntry | FeedEntry;
          const coord = (feature.getGeometry() as Point).getCoordinates();
          overlay.setPosition(coord);
          optionsRef.current.onEntryClick(entry);
          return true;
        }
      });
      if (!hit) {
        overlay.setPosition(undefined);
        optionsRef.current.onEmptyClick();
      }
    };

    map.on('click', handleClick as never);
    return () => {
      map.un('click', handleClick as never);
      map.removeOverlay(overlay);
      map.removeLayer(optionsRef.current.feedEntriesLayer);
      map.removeLayer(optionsRef.current.journalEntriesLayer);
      map.removeLayer(optionsRef.current.selectedPlaceLayer);
    };
  }, [map]);

  return { popupOverlayEl, popupOverlay, userLocation };
}
