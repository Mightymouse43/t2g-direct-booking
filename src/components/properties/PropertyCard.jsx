import { Link } from 'react-router-dom';
import { BedDouble, Bath, Users, MapPin } from 'lucide-react';

/**
 * Extracts a usable photo URL from various OwnerRez photo shapes.
 */
function getPhotoUrl(property) {
  const photos = property.photos ?? [];
  if (photos.length) {
    const first = photos[0];
    return first.url ?? first.medium_url ?? first.large_url ?? first.thumbnail_url ?? null;
  }
  // Fallback: OwnerRez sometimes puts a thumbnail on the property object
  return property.thumbnail_url ?? property.primary_photo_url ?? null;
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=70&auto=format&fit=crop';

export default function PropertyCard({ property }) {
  const photoUrl = getPhotoUrl(property) ?? PLACEHOLDER;
  const price = property.avg_nightly_rate ?? property.base_nightly_rate ?? property.min_rate;
  const city = property.city ?? property.location ?? '';
  const state = property.state ?? '';
  const location = [city, state].filter(Boolean).join(', ');

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-xl card-hover"
    >
      {/* Image */}
      <div className="aspect-video w-full overflow-hidden img-zoom">
        <img
          src={photoUrl}
          alt={property.name ?? 'Vacation rental'}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div className="p-5">
        {location && (
          <p className="mb-1 flex items-center gap-1.5 font-body text-xs text-t2g-teal">
            <MapPin className="h-3.5 w-3.5" />
            {location}
          </p>
        )}
        <h3 className="font-heading text-base font-semibold text-t2g-navy line-clamp-1 group-hover:text-t2g-teal transition-colors">
          {property.name}
        </h3>

        {/* Stats row */}
        <div className="mt-3 flex flex-wrap items-center gap-4 font-body text-xs text-t2g-slate/80">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 text-t2g-navy/50" />
              {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-t2g-navy/50" />
              {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
            </span>
          )}
          {property.max_guests != null && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-t2g-navy/50" />
              {property.max_guests} guests
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-4 flex items-center justify-between border-t border-t2g-mist pt-4">
          {price != null ? (
            <p className="font-heading text-sm font-semibold text-t2g-navy">
              From{' '}
              <span className="text-lg">
                ${Number(price).toLocaleString()}
              </span>
              <span className="font-normal text-t2g-slate/60"> / night</span>
            </p>
          ) : (
            <p className="font-body text-sm text-t2g-slate/60">Contact for rates</p>
          )}
          <span className="font-heading text-xs font-semibold uppercase tracking-wide text-t2g-teal group-hover:underline">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
