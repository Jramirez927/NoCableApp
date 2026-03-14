import React, { useState } from 'react';
import styles from './Storymap.module.css';
import { createPortal } from 'react-dom';
import LocationSearch, { NominatimResult } from '../../components/LocationSearch/LocationSearch';
import LocationSearchToggle from './maptools/LocationSearchToggle';
import AddJournalEntryButton from './maptools/AddJournalEntryButton';
import JournalEntryForm from './maptools/JournalEntryForm';
import AddPinButton from './maptools/AddPinButton';
import { JournalEntry } from '../../api/JournalEntries';
import { useMap } from '../../contexts/MapProvider';
import { fromLonLat, toLonLat } from 'ol/proj';
import JournalEntryPopup from './JournalEntryPopup';
import StorymapSidebar from './navbar/StorymapSidebar';
import StorymapIconNavbar from './navbar/StorymapIconNavbar';
import StorymapFeedPanel from './navbar/StorymapFeedPanel';
import StorymapFriendsPanel from './navbar/StorymapFriendsPanel';
import { useJournalEntries } from './hooks/useJournalEntries';
import { useSelectedPlace } from './hooks/useSelectedPlace';
import { useMapSetup } from './hooks/useMapSetup';

const StoryMap: React.FC = () => {
  const { map, mapDivRef } = useMap();
  const [selectedJournalEntry, setSelectedJournalEntry] = useState<
    (JournalEntry & { userName?: string }) | null
  >(null);
  const [locationSearchOpen, setLocationSearchOpen] = useState(false);
  const [journalFormOpen, setJournalFormOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'entries' | 'feed' | 'friends' | null>(null);

  const {
    journalEntries,
    journalEntriesLayer,
    feedEntriesLayer,
    loadEntries,
    handleCreateEntry,
    handleDeleteEntry,
  } = useJournalEntries();

  const {
    selectedPlace,
    setSelectedPlace,
    selectedPlaceName,
    setSelectedPlaceName,
    selectedPlaceLayer,
  } = useSelectedPlace(map);

  const { popupOverlayEl, popupOverlay, userLocation } = useMapSetup(map, {
    journalEntriesLayer,
    feedEntriesLayer,
    selectedPlaceLayer,
    onLoad: loadEntries,
    onEntryClick: (entry) => {
      setJournalFormOpen(false);
      setSelectedJournalEntry(entry as JournalEntry & { userName?: string });
    },
    onEmptyClick: () => {
      setSelectedJournalEntry(null);
    },
  });

  const handleJournalFormToggle = () => {
    if (journalFormOpen) {
      popupOverlay.current?.setPosition(undefined);
      setJournalFormOpen(false);
    } else {
      if (selectedPlace) {
        const [lon, lat] = toLonLat(selectedPlace);
        setSelectedJournalEntry(null);
        popupOverlay.current?.setPosition(fromLonLat([lon, lat]));
      }
      setJournalFormOpen(true);
    }
  };

  const handleLocationSearchResult = (place: NominatimResult) => {
    map!.getTargetElement().style.cursor = '';
    setSelectedPlace(fromLonLat([parseFloat(place.lon), parseFloat(place.lat)]));
    setSelectedPlaceName(place.display_name);
    setLocationSearchOpen(false);
  };

  const handleSubmitEntry = async (formData: {
    title: string;
    body: string;
    dateVisited: string;
  }) => {
    if (!selectedPlace) return;
    const [lon, lat] = toLonLat(selectedPlace);
    await handleCreateEntry({
      title: formData.title,
      body: formData.body,
      placeName: selectedPlaceName,
      latitude: lat,
      longitude: lon,
      dateVisited: formData.dateVisited,
    });
    map!.getTargetElement().style.cursor = '';
    setSelectedPlace(null);
    popupOverlay.current?.setPosition(undefined);
    setJournalFormOpen(false);
  };

  const handleDeleteAndClose = async (id: number) => {
    const deleted = await handleDeleteEntry(id);
    if (deleted) setSelectedJournalEntry(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mapWrapper}>
        <div ref={mapDivRef} className={styles.mapDiv} />
        {locationSearchOpen && (
          <div className={styles.searchDropdown}>
            <LocationSearch onSelect={handleLocationSearchResult} near={userLocation} />
          </div>
        )}
        <div className={styles.bottomControls}>
          <LocationSearchToggle
            open={locationSearchOpen}
            onToggle={() => setLocationSearchOpen((p) => !p)}
          />
          {selectedPlace && (
            <AddJournalEntryButton open={journalFormOpen} onToggle={handleJournalFormToggle} />
          )}
          <AddPinButton
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
            selectedPlaceLayer={selectedPlaceLayer}
          />
        </div>
      </div>
      {activePanel === 'friends' && (
        <div className={styles.sidePanel}>
          <StorymapFriendsPanel />
        </div>
      )}
      {activePanel === 'feed' && (
        <div className={styles.sidePanel}>
          <StorymapFeedPanel />
        </div>
      )}
      {activePanel === 'entries' && (
        <div className={styles.sidePanel}>
          <StorymapSidebar entries={journalEntries} />
        </div>
      )}
      <StorymapIconNavbar activePanel={activePanel} onToggle={setActivePanel} />
      {createPortal(
        journalFormOpen && selectedPlace ? (
          <JournalEntryForm
            placeName={selectedPlaceName}
            onSubmit={handleSubmitEntry}
            onCancel={() => {
              popupOverlay.current?.setPosition(undefined);
              setJournalFormOpen(false);
            }}
          />
        ) : selectedJournalEntry ? (
          <JournalEntryPopup
            entry={selectedJournalEntry}
            onClose={() => {
              popupOverlay.current?.setPosition(undefined);
              setSelectedJournalEntry(null);
            }}
            onDelete={'userName' in selectedJournalEntry ? undefined : handleDeleteAndClose}
          />
        ) : null,
        popupOverlayEl.current
      )}
    </div>
  );
};

export default StoryMap;
