import { useState, useEffect } from 'react';
import { fetchProperties } from '../api/ownerrez';

/**
 * Fetches the full properties list from /api/properties.
 * Returns { properties, loading, error, refetch }
 *
 * OwnerRez returns: { items: [...], total_count: N }
 * We normalise to a flat array for convenience.
 */
export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProperties();
      // OwnerRez v2 wraps arrays in { items: [] }
      setProperties(Array.isArray(data) ? data : data?.items ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { properties, loading, error, refetch: load };
}
