import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

// Inline SVGs for brand icons (lucide deprecated social icons in recent versions)
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const PROPERTY_LINKS = [
  { to: '/properties', label: 'All Properties' },
  { to: '/properties?beds=2', label: '2-Bedroom Homes' },
  { to: '/properties?beds=3', label: '3-Bedroom Homes' },
  { to: '/properties?beds=4', label: '4+ Bedroom Homes' },
];

const COMPANY_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/properties', label: 'Browse Properties' },
];

export default function Footer() {
  return (
    <footer className="bg-t2g-navy rounded-t-[4rem] mt-24">
      <div className="section-padding py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-1 space-y-5">
            <img src="/logo.png" alt="T2G Vacation Home Rentals" className="h-12 w-auto brightness-0 invert" />
            <p className="font-body text-sm text-t2g-mist/70 leading-relaxed max-w-xs">
              Furnished vacation rentals and corporate housing in San Jose, CA. Book direct and save 15%.
            </p>
            {/* Status dot */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-t2g-green opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-t2g-green" />
              </span>
              <span className="font-body text-xs text-t2g-green font-medium">System Operational</span>
            </div>
          </div>

          {/* Properties */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-widest text-t2g-mist/50">
              Properties
            </h4>
            <ul className="space-y-2.5">
              {PROPERTY_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="font-body text-sm text-t2g-mist/70 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-widest text-t2g-mist/50">
              Company
            </h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="font-body text-sm text-t2g-mist/70 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-widest text-t2g-mist/50">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-t2g-mist/70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-t2g-teal" />
                <span className="font-body text-sm">San Jose, CA</span>
              </li>
              <li>
                <a
                  href="mailto:hello@t2grentals.com"
                  className="flex items-center gap-3 font-body text-sm text-t2g-mist/70 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-t2g-teal" />
                  hello@t2grentals.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+1-555-0100"
                  className="flex items-center gap-3 font-body text-sm text-t2g-mist/70 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-t2g-teal" />
                  (555) 010-0100
                </a>
              </li>
            </ul>
            {/* Social */}
            <div className="flex gap-3 pt-2">
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-t2g-mist/70 hover:bg-t2g-teal hover:text-white transition-all">
                <IconInstagram />
              </a>
              <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-t2g-mist/70 hover:bg-t2g-teal hover:text-white transition-all">
                <IconFacebook />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8">
          <p className="font-body text-xs text-t2g-mist/40">
            &copy; {new Date().getFullYear()} T2G Vacation Home Rentals. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <img src="/superhost-emblem.jpg" alt="Airbnb Superhost" className="h-6 w-auto rounded opacity-60" />
            <span className="font-body text-xs text-t2g-mist/40">Superhost Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
