import { useState, useEffect } from 'react';
import { fetchReviews } from '../api/ownerrez';

/**
 * Fetches guest reviews for a property from /api/reviews.
 * @param {string|number} propertyId
 */
export function useReviews(propertyId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!propertyId) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchReviews(propertyId);
        const items = Array.isArray(data) ? data : data?.items ?? [];
        if (!cancelled) setReviews(items);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [propertyId]);

  return { reviews, loading, error };
}
