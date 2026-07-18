import { useEffect, useRef, useState } from 'react';
import { parseSheetRows, parseItineraryRows, SHEET_CSV_URL, ITINERARY_CSV_URL } from '../lib/parseSheet';

const POLL_INTERVAL_MS = 30_000;

export function useSheetData() {
  const [treks, setTreks] = useState([]);
  const [itineraries, setItineraries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const abortRef = useRef(null);

  async function fetchData() {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const [treksRes, itinRes] = await Promise.all([
        fetch(SHEET_CSV_URL, { signal: controller.signal }),
        fetch(ITINERARY_CSV_URL, { signal: controller.signal }),
      ]);
      if (!treksRes.ok) throw new Error(`Treks sheet: HTTP ${treksRes.status}`);

      const [treksText, itinText] = await Promise.all([treksRes.text(), itinRes.ok ? itinRes.text() : Promise.resolve('')]);

      setTreks(parseSheetRows(treksText));
      if (itinText) setItineraries(parseItineraryRows(itinText));
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => {
      clearInterval(timer);
      abortRef.current?.abort();
    };
  }, []);

  return { treks, itineraries, loading, error, lastUpdated, refetch: fetchData };
}
