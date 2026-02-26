import { useState } from 'react';
import { getAmenityIcon } from '../../utils/amenityIcons';

const INITIAL_SHOW = 12;

/**
 * Renders a grid of amenity chips with Lucide icons.
 * Shows up to INITIAL_SHOW items, with a "+ N more" expand button.
 *
 * OwnerRez returns amenities in different shapes depending on the endpoint:
 *   - Array of strings: ["WiFi", "Pool", ...]
 *   - Array of objects: [{ name: "WiFi" }, ...]
 */
function normalizeAmenities(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((a) => (typeof a === 'string' ? a : a?.name ?? a?.label ?? null))
    .filter(Boolean);
}

function AmenityChip({ name }) {
  const Icon = getAmenityIcon(name);
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-t2g-mist bg-white px-3 py-2.5 shadow-sm">
      <Icon className="h-4 w-4 shrink-0 text-t2g-teal" />
      <span className="font-body text-sm text-t2g-navy">{name}</span>
    </div>
  );
}

export default function AmenitiesGrid({ amenities }) {
  const [expanded, setExpanded] = useState(false);
  const items = normalizeAmenities(amenities);

  if (!items.length) return null;

  const visible = expanded ? items : items.slice(0, INITIAL_SHOW);
  const remainder = items.length - INITIAL_SHOW;

  return (
    <div>
      <h2 className="mb-4 font-heading text-xl font-bold text-t2g-navy">Amenities</h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((name) => (
          <AmenityChip key={name} name={name} />
        ))}
      </div>

      {!expanded && remainder > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-4 font-heading text-sm font-semibold text-t2g-teal underline underline-offset-2 hover:text-t2g-navy transition-colors"
        >
          + {remainder} more amenities
        </button>
      )}
      {expanded && items.length > INITIAL_SHOW && (
        <button
          onClick={() => setExpanded(false)}
          className="mt-4 font-heading text-sm font-semibold text-t2g-teal underline underline-offset-2 hover:text-t2g-navy transition-colors"
        >
          Show fewer
        </button>
      )}
    </div>
  );
}
