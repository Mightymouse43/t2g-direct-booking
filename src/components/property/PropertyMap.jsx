import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

// Offset from exact coordinates for guest privacy (~200–300 m)
const PRIVACY_OFFSET = 0.002;

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

/* ─── Google Maps Embed iframe ───────────────────────────── */
function GoogleMap({ approxLat, approxLng }) {
  // "view" mode: clean centered map, no marker, no address label shown
  const src = `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_KEY}&center=${approxLat},${approxLng}&zoom=15&maptype=roadmap`;
  return (
    <iframe
      title="Property location map"
      src={src}
      width="100%"
      height="320"
      style={{ border: 0, display: 'block' }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

/* ─── Leaflet fallback ───────────────────────────────────── */
function LeafletMap({ approxLat, approxLng }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let map;
    import('leaflet').then(({ default: L }) => {
      import('leaflet/dist/leaflet.css');
      if (!containerRef.current) return;

      map = L.map(containerRef.current, {
        center: [approxLat, approxLng],
        zoom: 14,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: '',
        html: `<div style="width:18px;height:18px;border-radius:50%;background:#2E8B8E;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      L.marker([approxLat, approxLng], { icon }).addTo(map);
      mapRef.current = map;
    });

    return () => {
      map?.remove();
      mapRef.current = null;
    };
  }, [approxLat, approxLng]);

  return <div ref={containerRef} style={{ height: '320px' }} />;
}

/* ─── Main export ────────────────────────────────────────── */
export default function PropertyMap({ property }) {
  const lat = property?.latitude;
  const lng = property?.longitude;

  if (!lat || !lng) return null;

  const approxLat = lat + PRIVACY_OFFSET;
  const approxLng = lng + PRIVACY_OFFSET;

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <MapPin className="h-5 w-5 text-t2g-teal" />
        <h2 className="font-heading text-2xl font-bold text-t2g-navy">Location</h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-t2g-mist shadow-sm">
        {GOOGLE_MAPS_KEY
          ? <GoogleMap approxLat={approxLat} approxLng={approxLng} />
          : <LeafletMap approxLat={approxLat} approxLng={approxLng} />
        }
        <p className="border-t border-t2g-mist bg-white px-4 py-3 font-body text-xs text-t2g-slate/60">
          Approximate location shown · Exact address provided after booking
        </p>
      </div>
    </section>
  );
}
