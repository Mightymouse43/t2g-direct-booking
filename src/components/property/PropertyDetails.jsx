import { BedDouble, Bath, Users, Home } from 'lucide-react';

function Stat({ icon: Icon, label, value }) {
  if (value == null) return null;
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-t2g-mist bg-white px-5 py-4 shadow-sm">
      <Icon className="h-5 w-5 text-t2g-teal" />
      <span className="font-heading text-xl font-bold text-t2g-navy">{value}</span>
      <span className="font-body text-xs text-t2g-slate/70">{label}</span>
    </div>
  );
}

/**
 * Quick-stats row: beds / baths / guests / property type.
 */
export default function PropertyDetails({ property }) {
  const beds = property?.bedrooms;
  const baths = property?.bathrooms;
  const guests = property?.max_guests;
  const type = property?.property_type_label ?? property?.property_type ?? null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat icon={BedDouble} label={beds === 1 ? 'Bedroom' : 'Bedrooms'} value={beds} />
      <Stat icon={Bath} label={baths === 1 ? 'Bathroom' : 'Bathrooms'} value={baths} />
      <Stat icon={Users} label="Max Guests" value={guests} />
      <Stat icon={Home} label="Type" value={type} />
    </div>
  );
}
