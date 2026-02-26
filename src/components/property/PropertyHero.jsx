import { MapPin } from 'lucide-react';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=80&auto=format&fit=crop';

/**
 * Full-width hero for the property detail page.
 * Shows the primary photo with a gradient overlay, property name, and location.
 */
export default function PropertyHero({ property }) {
  const photos = property?.photos ?? [];
  const heroUrl =
    photos[0]?.url ??
    photos[0]?.large_url ??
    photos[0]?.medium_url ??
    property?.thumbnail_url ??
    PLACEHOLDER;

  const city = property?.city ?? property?.location ?? '';
  const state = property?.state ?? '';
  const location = [city, state].filter(Boolean).join(', ');

  return (
    <div className="relative h-[55vh] min-h-[360px] w-full overflow-hidden">
      <img
        src={heroUrl}
        alt={property?.name ?? 'Property'}
        className="h-full w-full object-cover"
      />
      {/* gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-t2g-navy/80 via-t2g-navy/20 to-transparent" />

      {/* text content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 section-padding">
        {location && (
          <p className="mb-2 flex items-center gap-1.5 font-body text-sm text-t2g-teal">
            <MapPin className="h-4 w-4" />
            {location}
          </p>
        )}
        <h1 className="font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          {property?.name ?? 'Property Details'}
        </h1>
      </div>
    </div>
  );
}
