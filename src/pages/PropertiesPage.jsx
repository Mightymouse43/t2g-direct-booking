import { useState, useMemo } from 'react';
import { useProperties } from '../hooks/useProperties';
import PropertyFilters from '../components/properties/PropertyFilters';
import PropertyGrid from '../components/properties/PropertyGrid';
import SectionLabel from '../components/ui/SectionLabel';

const DEFAULT_FILTERS = { bedrooms: null, maxGuests: null };

function applyFilters(properties, { bedrooms, maxGuests }) {
  return properties.filter((p) => {
    if (bedrooms !== null && (p.bedrooms ?? 0) < bedrooms) return false;
    if (maxGuests !== null && (p.max_guests ?? 0) < maxGuests) return false;
    return true;
  });
}

export default function PropertiesPage() {
  const { properties, loading, error, refetch } = useProperties();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const filtered = useMemo(
    () => applyFilters(properties, filters),
    [properties, filters]
  );

  return (
    <div className="min-h-screen bg-t2g-cloud">
      {/* ── Page header ── */}
      <div className="bg-t2g-navy section-padding pt-36 pb-14">
        <div className="max-w-2xl">
          <SectionLabel light>San Jose, CA</SectionLabel>
          <h1 className="mt-4 font-heading text-4xl font-bold text-white md:text-5xl">
            All{' '}
            <span className="font-display italic text-t2g-sand">Properties</span>
          </h1>
          <p className="mt-4 font-body text-base text-white/60 leading-relaxed">
            Fully furnished vacation rentals and corporate housing — book direct
            and skip the OTA fees.
          </p>
        </div>
      </div>

      {/* ── Filters + Grid ── */}
      <div className="section-padding section-y space-y-8">
        <PropertyFilters
          filters={filters}
          onChange={setFilters}
          total={filtered.length}
        />
        <PropertyGrid
          properties={filtered}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
      </div>
    </div>
  );
}
