import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Clock, Maximize2, PawPrint, MapPin } from 'lucide-react';
import { useProperty } from '../hooks/useProperty';
import PhotoGallery from '../components/property/PhotoGallery';
import PropertyDetails from '../components/property/PropertyDetails';
import PropertyDescription from '../components/property/PropertyDescription';
import AmenitiesGrid from '../components/property/AmenitiesGrid';
import AvailabilityCalendar from '../components/property/AvailabilityCalendar';
import BookingWidget from '../components/property/BookingWidget';
import PropertyMap from '../components/property/PropertyMap';
import PropertyReviews from '../components/property/PropertyReviews';
import ErrorState from '../components/ui/ErrorState';

/* ─────────────────────────────────────────────────────────
   Skeleton while data loads
───────────────────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Full-bleed photo skeleton */}
      <div className="h-[60vh] w-full bg-t2g-mist/60" />
      <div className="mx-auto max-w-7xl section-padding py-10">
        {/* Title skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-3 w-28 rounded bg-t2g-mist/60" />
          <div className="h-9 w-2/3 rounded bg-t2g-mist/60" />
        </div>
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-t2g-mist/60" />)}
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-t2g-mist/60" />
              <div className="h-4 w-full rounded bg-t2g-mist/60" />
              <div className="h-4 w-5/6 rounded bg-t2g-mist/60" />
            </div>
          </div>
          <div className="h-80 rounded-3xl bg-t2g-mist/60 lg:sticky lg:top-28" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Property info section — check-in/out, area, pets, listing link
───────────────────────────────────────────────────────── */
function PropertyInfo({ property }) {
  const checkIn = property?.check_in;
  const checkOut = property?.check_out;
  const area = property?.living_area;
  const areaType = property?.living_area_type ?? 'sq. ft.';
  const maxPets = property?.max_pets;
  const publicUrl = property?.public_url;

  const rows = [
    checkIn && { label: 'Check-in', value: checkIn, icon: Clock },
    checkOut && { label: 'Check-out', value: checkOut, icon: Clock },
    area && { label: 'Living area', value: `${area.toLocaleString()} ${areaType}`, icon: Maximize2 },
    maxPets != null && { label: 'Pets', value: maxPets > 0 ? `Up to ${maxPets} pet${maxPets !== 1 ? 's' : ''}` : 'No pets', icon: PawPrint },
  ].filter(Boolean);

  if (!rows.length && !publicUrl) return null;

  return (
    <div>
      {rows.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {rows.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col gap-1 rounded-2xl border border-t2g-mist bg-white p-4 shadow-sm">
              <Icon className="h-4 w-4 text-t2g-teal" />
              <span className="font-heading text-sm font-semibold text-t2g-navy">{value}</span>
              <span className="font-body text-xs text-t2g-slate/60">{label}</span>
            </div>
          ))}
        </div>
      )}

      {publicUrl && (
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-body text-sm text-t2g-teal hover:text-t2g-navy transition-colors underline underline-offset-2"
        >
          View full listing details
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}


/* ─────────────────────────────────────────────────────────
   Mobile sticky bottom bar
───────────────────────────────────────────────────────── */
function MobileBookingBar({ property }) {
  const price = property?.avg_nightly_rate ?? property?.base_nightly_rate ?? property?.min_rate;
  const orBookingUrl = property?.booking_url ?? null;
  const href = orBookingUrl
    ? orBookingUrl
    : `mailto:tenants2guest@gmail.com?subject=Booking enquiry: ${encodeURIComponent(property?.name ?? 'Property')}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-t2g-mist bg-white px-4 py-3 shadow-2xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
        {price != null && (
          <p className="font-heading text-lg font-bold text-t2g-navy">
            ${Number(price).toLocaleString()}
            <span className="font-normal text-sm text-t2g-slate/60">/night</span>
          </p>
        )}
        <a
          href={href}
          target={orBookingUrl ? '_blank' : undefined}
          rel={orBookingUrl ? 'noopener noreferrer' : undefined}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-t2g-teal px-5 py-3 font-heading text-sm font-semibold text-white shadow-md"
        >
          <Calendar className="h-4 w-4" />
          Book Now
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────── */
export default function PropertyDetailPage() {
  const { id } = useParams();
  const { property, loading, error, refetch } = useProperty(id);

  // Re-load widget.js once property data is ready so OwnerRez can scan the
  // correct DOM nodes after client-side React Router navigation.
  useEffect(() => {
    if (!property) return;
    const old = document.querySelector('script[src*="ownerrez.com/widget.js"]');
    if (old) old.remove();
    const s = document.createElement('script');
    s.src = 'https://app.ownerrez.com/widget.js';
    s.async = true;
    document.body.appendChild(s);
    return () => {
      const script = document.querySelector('script[src*="ownerrez.com/widget.js"]');
      if (script) script.remove();
    };
  }, [property]);

  if (loading) return <DetailSkeleton />;
  if (error) {
    return (
      <div className="pt-32 section-padding section-y">
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }
  if (!property) return null;

  const photos = property.photos ?? [];
  const amenities =
    property.amenities ??
    property.amenity_list ??
    property.amenityList ??
    property.features ??
    [];
  const amenityGroups = property.amenityGroups ?? [];
  const city = property?.city ?? property?.location ?? '';
  const state = property?.state ?? '';
  const location = [city, state].filter(Boolean).join(', ');

  return (
    <>
      {/* ── Full-bleed photo gallery ─────────────────────── */}
      {photos.length > 0 && (
        <PhotoGallery
          photos={photos}
          wrapperClassName="overflow-hidden"
          imgHeight="clamp(400px, 60vh, 640px)"
        />
      )}

      <div className="mx-auto max-w-7xl section-padding pb-24 pt-8 lg:pb-12">
        {/* Back link */}
        <Link
          to="/properties"
          className="mb-6 inline-flex items-center gap-1.5 font-body text-sm text-t2g-teal hover:text-t2g-navy transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all properties
        </Link>

        {/* Property title + location */}
        <div className="mb-8">
          {location && (
            <p className="mb-2 flex items-center gap-1.5 font-body text-sm text-t2g-teal">
              <MapPin className="h-4 w-4" />
              {location}
            </p>
          )}
          <h1 className="font-heading text-3xl font-bold text-t2g-navy md:text-4xl lg:text-5xl">
            {property.name ?? 'Property Details'}
          </h1>
        </div>

        {/* ── Two-column layout ───────────────────────────── */}
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">

          {/* ── Left column ─────────────────────────────── */}
          <div className="space-y-10">
            <PropertyDetails property={property} />
            <PropertyDescription description={property.description} />
            <AvailabilityCalendar />
            <PropertyInfo property={property} />
            <PropertyMap property={property} />
            {(amenityGroups.length > 0 || amenities.length > 0) && (
              <AmenitiesGrid amenities={amenities} amenityGroups={amenityGroups} />
            )}
            <PropertyReviews propertyId={id} reviewMeta={property.reviewMeta} />
          </div>

          {/* ── Right column (desktop sticky) ───────────── */}
          <div className="hidden lg:block">
            <BookingWidget />
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <MobileBookingBar property={property} />
    </>
  );
}
