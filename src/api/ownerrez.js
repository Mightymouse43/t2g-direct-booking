/**
 * Client-side API module.
 * ALL calls go to /api/* (Vercel serverless proxy).
 * The OwnerRez PAT is NEVER accessed from the browser.
 */

const API_BASE = '/api';

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `API error ${res.status}`);
  }
  return res.json();
}

/** Fetch all properties */
export function fetchProperties() {
  return apiFetch('/properties');
}

/** Fetch a single property (with photos merged in) */
export function fetchProperty(id) {
  return apiFetch(`/property?id=${encodeURIComponent(id)}`);
}

/**
 * Fetch availability for a property.
 * @param {string|number} propertyId
 * @param {string} [from] YYYY-MM-DD
 * @param {string} [to]   YYYY-MM-DD
 */
export function fetchAvailability(propertyId, from, to) {
  const params = new URLSearchParams({ propertyId });
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  return apiFetch(`/availability?${params.toString()}`);
}

/** Fetch guest reviews. Pass propertyId to filter by property, or omit for all. */
export function fetchReviews(propertyId) {
  const params = new URLSearchParams();
  if (propertyId) params.set('propertyId', propertyId);
  const qs = params.toString();
  return apiFetch(`/reviews${qs ? `?${qs}` : ''}`);
}
