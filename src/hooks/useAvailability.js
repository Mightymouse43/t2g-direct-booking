import { useState, useEffect } from 'react';
import { fetchAvailability } from '../api/ownerrez';

/**
 * Fetches availability for a property from /api/availability.
 * @param {string|number} propertyId
 * @param {string} [from] YYYY-MM-DD
 * @param {string} [to]   YYYY-MM-DD
 */
export function useAvailability(propertyId, from, to) {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!propertyId) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAvailability(propertyId, from, to);
        if (!cancelled) setAvailability(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [propertyId, from, to]);

  return { availability, loading, error };
}
