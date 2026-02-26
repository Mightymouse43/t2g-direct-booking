/**
 * PropertyFilters
 *
 * Pill-style filter bar for the Properties listing page.
 * All filtering is client-side — no API calls.
 *
 * Props:
 *   filters  — { bedrooms: number|null, maxGuests: number|null }
 *   onChange — (updatedFilters) => void
 *   total    — total number of results (for the count badge)
 */

const BEDROOM_OPTIONS = [
  { label: 'Any', value: null },
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
];

const GUEST_OPTIONS = [
  { label: 'Any', value: null },
  { label: '2+', value: 2 },
  { label: '4+', value: 4 },
  { label: '6+', value: 6 },
  { label: '8+', value: 8 },
];

function PillGroup({ label, options, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-heading text-xs font-semibold uppercase tracking-widest text-t2g-slate/60 mr-1">
        {label}
      </span>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              'rounded-full px-4 py-1.5 font-heading text-xs font-semibold transition-all duration-200',
              active
                ? 'bg-t2g-navy text-white shadow-sm'
                : 'bg-white border border-t2g-mist text-t2g-slate hover:border-t2g-navy hover:text-t2g-navy',
            ].join(' ')}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function PropertyFilters({ filters, onChange, total }) {
  const hasActiveFilters = filters.bedrooms !== null || filters.maxGuests !== null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-t2g-mist bg-white px-5 py-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
        <PillGroup
          label="Bedrooms"
          options={BEDROOM_OPTIONS}
          value={filters.bedrooms}
          onChange={(v) => onChange({ ...filters, bedrooms: v })}
        />
        <div className="h-px bg-t2g-mist sm:h-6 sm:w-px" />
        <PillGroup
          label="Guests"
          options={GUEST_OPTIONS}
          value={filters.maxGuests}
          onChange={(v) => onChange({ ...filters, maxGuests: v })}
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Result count */}
        <span className="font-body text-sm text-t2g-slate/60">
          {total} {total === 1 ? 'property' : 'properties'}
        </span>

        {/* Clear button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => onChange({ bedrooms: null, maxGuests: null })}
            className="font-heading text-xs font-semibold text-t2g-teal hover:text-t2g-navy transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
