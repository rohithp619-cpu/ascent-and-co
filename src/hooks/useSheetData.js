import { useEffect, useRef, useState } from 'react';
import { parseSheetRows, SHEET_CSV_URL } from '../lib/parseSheet';

const POLL_INTERVAL_MS = 30_000;

export function useSheetData() {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const abortRef = useRef(null);

  async function fetchData() {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(SHEET_CSV_URL, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseSheetRows(text);
      setTreks(parsed);
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

  return { treks, loading, error, lastUpdated, refetch: fetchData };
}
