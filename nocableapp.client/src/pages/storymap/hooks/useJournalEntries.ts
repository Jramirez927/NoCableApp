import { useEffect, useRef, useState } from 'react';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import {
  getJournalEntries,
  getFeedEntries,
  createJournalEntry,
  deleteJournalEntry,
  JournalEntry,
  JournalEntryPayload,
  FeedEntry,
} from '../../../api/JournalEntries';
import { MapUtils } from '../../../utils/MapUtils';

const entryStyle = MapUtils.createEntryStyle('#f3250e', 0.2);
const feedEntryStyle = MapUtils.createEntryStyle('#1a6fc4', 0.2);

export function useJournalEntries() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [feedEntries, setFeedEntries] = useState<FeedEntry[]>([]);

  const journalEntriesSource = useRef(new VectorSource());
  const journalEntriesLayer = useRef(
    new VectorLayer({ source: journalEntriesSource.current, style: entryStyle })
  );

  const feedEntriesSource = useRef(new VectorSource());
  const feedEntriesLayer = useRef(
    new VectorLayer({ source: feedEntriesSource.current, style: feedEntryStyle })
  );

  useEffect(() => {
    journalEntriesSource.current.clear();
    journalEntries.forEach((entry) => {
      const feature = new Feature(new Point(fromLonLat([entry.longitude, entry.latitude])));
      feature.setProperties(entry);
      journalEntriesSource.current.addFeature(feature);
    });
  }, [journalEntries]);

  useEffect(() => {
    feedEntriesSource.current.clear();
    feedEntries.forEach((entry) => {
      const feature = new Feature(new Point(fromLonLat([entry.longitude, entry.latitude])));
      feature.setProperties(entry);
      feedEntriesSource.current.addFeature(feature);
    });
  }, [feedEntries]);

  async function loadEntries() {
    const [entriesResult, feedResult] = await Promise.all([getJournalEntries(), getFeedEntries()]);
    if (entriesResult.data) setJournalEntries(entriesResult.data);
    if (feedResult.data) setFeedEntries(feedResult.data);
  }

  async function handleCreateEntry(payload: JournalEntryPayload) {
    const { data } = await createJournalEntry(payload);
    if (data) setJournalEntries((prev) => [...prev, data]);
  }

  async function handleDeleteEntry(id: number): Promise<boolean> {
    const { error } = await deleteJournalEntry(id);
    if (!error) {
      setJournalEntries((prev) => prev.filter((e) => e.id !== id));
      return true;
    }
    return false;
  }

  return {
    journalEntries,
    feedEntries,
    journalEntriesLayer: journalEntriesLayer.current,
    feedEntriesLayer: feedEntriesLayer.current,
    loadEntries,
    handleCreateEntry,
    handleDeleteEntry,
  };
}
