import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Offset from exact address for guest privacy (~200–300 m)
const PRIVACY_OFFSET = 0.002;

export default function PropertyMap({ property }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  const lat = property?.latitude;
  const lng = property?.longitude;

  useEffect(() => {
    if (!lat || !lng || !containerRef.current) return;
    // Guard against StrictMode double-invoke
    if (mapRef.current) return;

    const approxLat = lat + PRIVACY_OFFSET;
    const approxLng = lng + PRIVACY_OFFSET;

    const map = L.map(containerRef.current, {
      center: [approxLat, approxLng],
      zoom: 14,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom teal circle marker — avoids Leaflet's bundler icon-URL issues
    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width: 18px; height: 18px; border-radius: 50%;
        background: #2E8B8E; border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      "></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    L.marker([approxLat, approxLng], { icon }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng]);

  if (!lat || !lng) return null;

  return (
    <section>
      {/* Section header */}
      <div className="mb-6 flex items-center gap-3">
        <MapPin className="h-5 w-5 text-t2g-teal" />
        <h2 className="font-heading text-2xl font-bold text-t2g-navy">Location</h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-t2g-mist shadow-sm">
        {/* Map canvas */}
        <div ref={containerRef} style={{ height: '320px' }} />

        {/* Privacy notice */}
        <p className="border-t border-t2g-mist bg-white px-4 py-3 font-body text-xs text-t2g-slate/60">
          Approximate location shown · Exact address provided after booking
        </p>
      </div>
    </section>
  );
}
