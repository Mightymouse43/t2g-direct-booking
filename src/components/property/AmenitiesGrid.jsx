import { useState, useMemo } from 'react';
import { getAmenityIcon } from '../../utils/amenityIcons';
import {
  Home,
  Tv,
  UtensilsCrossed,
  Bath,
  TreePine,
  ShieldCheck,
  BedDouble,
  Baby,
  Car,
  Users,
  Sparkles,
  CheckCircle,
  Lock,
} from 'lucide-react';

/* ─── Category metadata ─────────────────────────────────────── */
// Keys cover both OwnerRez `type` values and plain English caption names
const CATEGORY_META = {
  // OwnerRez type values (exact, lowercase)
  propertytype:     { Icon: Home },
  accommodation:    { Icon: Home },
  checkintype:      { Icon: Lock },
  houserules:       { Icon: ShieldCheck },
  general:          { Icon: Home },
  entertainment:    { Icon: Tv },
  kitchen:          { Icon: UtensilsCrossed },
  bathroom:         { Icon: Bath },
  outdoor:          { Icon: TreePine },
  safety:           { Icon: ShieldCheck },
  bedroom:          { Icon: BedDouble },
  family:           { Icon: Baby },
  parking:          { Icon: Car },
  accessibility:    { Icon: Users },
  // Plain English caption variants
  'property type':  { Icon: Home },
  'check-in type':  { Icon: Lock },
  'house rules':    { Icon: ShieldCheck },
};

function getCategoryMeta(rawCategory) {
  if (!rawCategory) return { label: 'General', Icon: Home };
  const key = rawCategory.toLowerCase().replace(/[\s-]+/g, '');
  const meta = CATEGORY_META[key] ?? CATEGORY_META[rawCategory.toLowerCase()] ?? {};
  return { label: rawCategory, Icon: meta.Icon ?? CheckCircle };
}

/* ─── Single amenity row ────────────────────────────────────── */
function AmenityItem({ name }) {
  const Icon = getAmenityIcon(name);
  return (
    <div className="flex items-center gap-2.5 py-1">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-t2g-teal/10">
        <Icon className="h-3.5 w-3.5 text-t2g-teal" />
      </div>
      <span className="font-body text-sm text-t2g-navy">{name}</span>
    </div>
  );
}

/* ─── Category section ──────────────────────────────────────── */
function CategorySection({ category, type, items }) {
  // Prefer matching by OwnerRez `type` (e.g. "CheckInType") over caption text
  const { label, Icon } = getCategoryMeta(type ?? category);
  return (
    <div>
      {/* Category header */}
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-t2g-teal" />
        <span className="font-body text-xs font-semibold uppercase tracking-widest text-t2g-teal">
          {label}
        </span>
        <div className="flex-1 border-t border-t2g-mist" />
      </div>

      {/* Amenity grid */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((name) => (
          <AmenityItem key={name} name={name} />
        ))}
      </div>
    </div>
  );
}

/* ─── Normalise flat amenity list ───────────────────────────── */
function normalizeFlatList(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((a) => (typeof a === 'string' ? a : a?.name ?? a?.label ?? null))
    .filter(Boolean);
}

/* ─── Main export ───────────────────────────────────────────── */
const INITIAL_CATEGORY_COUNT = 3;

export default function AmenitiesGrid({ amenities, amenityGroups }) {
  const [expanded, setExpanded] = useState(false);

  // Build groups: prefer categorised data from the API, fall back to flat list
  const groups = useMemo(() => {
    if (Array.isArray(amenityGroups) && amenityGroups.length > 0) {
      return amenityGroups;
    }
    const flat = normalizeFlatList(amenities);
    return flat.length ? [{ category: null, items: flat }] : [];
  }, [amenityGroups, amenities]);

  if (!groups.length) return null;

  const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0);
  const visibleGroups = expanded ? groups : groups.slice(0, INITIAL_CATEGORY_COUNT);
  const hiddenCategories = groups.length - INITIAL_CATEGORY_COUNT;

  return (
    <section>
      {/* Section header */}
      <div className="mb-6 flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-t2g-teal" />
        <h2 className="font-heading text-2xl font-bold text-t2g-navy">Amenities</h2>
        <span className="rounded-full bg-t2g-teal/10 px-2.5 py-0.5 font-body text-xs font-semibold text-t2g-teal">
          {totalItems}
        </span>
      </div>

      {/* Category sections */}
      <div className="rounded-2xl border border-t2g-mist bg-white p-6 shadow-sm">
        <div className="space-y-6">
          {visibleGroups.map(({ category, type, items }) => (
            <CategorySection
              key={category ?? 'all'}
              category={category}
              type={type}
              items={items}
            />
          ))}
        </div>

        {/* Expand / collapse */}
        {groups.length > INITIAL_CATEGORY_COUNT && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-6 flex items-center gap-1.5 border-t border-t2g-mist pt-5 font-body text-sm font-semibold text-t2g-teal transition-colors hover:text-t2g-navy"
          >
            {expanded ? (
              <>Show fewer amenities</>
            ) : (
              <>
                Show all {hiddenCategories} more{' '}
                {hiddenCategories === 1 ? 'category' : 'categories'}
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}
