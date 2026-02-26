import { useState, useEffect } from 'react';
import { fetchProperty } from '../api/ownerrez';

/**
 * Fetches a single property (with photos) from /api/property?id=:id.
 * Returns { property, loading, error, refetch }
 */
export function useProperty(id) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProperty(id);
      setProperty(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  return { property, loading, error, refetch: load };
}
