import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/properties', label: 'Properties' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isTransparentPage = pathname === '/';

  return (
    <>
      <header
        className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl
          transition-all duration-500 ease-t2g rounded-full
          ${scrolled || !isTransparentPage
            ? 'bg-t2g-cloud/80 backdrop-blur-xl shadow-lg border border-t2g-mist'
            : 'bg-transparent border border-white/10'
          }`}
      >
        <nav className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src="/logo.png"
              alt="T2G Vacation Home Rentals"
              className="h-11 w-auto"
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `font-heading text-sm font-medium transition-colors duration-200
                    ${isActive
                      ? scrolled || !isTransparentPage
                        ? 'text-t2g-teal'
                        : 'text-t2g-sand'
                      : scrolled || !isTransparentPage
                        ? 'text-t2g-navy hover:text-t2g-teal'
                        : 'text-white hover:text-t2g-mist'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              as="a"
              href="/properties"
              variant={scrolled || !isTransparentPage ? 'primary' : 'secondary'}
              size="sm"
            >
              Book Direct
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-full transition-colors
              ${scrolled || !isTransparentPage ? 'text-t2g-navy' : 'text-white'}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile slide-in drawer */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ease-t2g md:hidden
          ${menuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-t2g-navy/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-t2g-cloud shadow-2xl
            flex flex-col p-8 gap-6 transition-transform duration-300 ease-t2g
            ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between">
            <img src="/logo.png" alt="T2G" className="h-8 w-auto" />
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5 text-t2g-navy" />
            </button>
          </div>
          <nav className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `font-heading text-lg font-semibold transition-colors
                  ${isActive ? 'text-t2g-teal' : 'text-t2g-navy hover:text-t2g-teal'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto">
            <Button as="a" href="/properties" variant="primary" className="w-full justify-center">
              Book Direct & Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
