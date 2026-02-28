import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Wifi, Star, Building2 } from 'lucide-react';
import Button from '../ui/Button';
import SectionLabel from '../ui/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

const SPLINE_SCENE_URL =
  'https://my.spline.design/mapcopycopy-FD1AKiNVz1HdUqteEk8w6H2S-viM/';

const LOCATIONS = [
  { icon: Building2, label: 'Downtown San Jose', sub: '5 min to SAP Center' },
  { icon: MapPin,    label: 'Japantown',          sub: 'Walkable dining & culture' },
  { icon: Wifi,      label: 'SJC Airport',         sub: '10 min door-to-door' },
];

export default function PrimeLocation() {
  const sectionRef = useRef(null);
  const [sceneLoaded, setSceneLoaded] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-loc-anim]', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from('[data-loc-map]', {
        opacity: 0,
        scale: 0.95,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-t2g-navy overflow-hidden"
    >
      {/* Subtle grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Teal glow — top-left */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-t2g-teal/10 blur-[120px]" />

      <div className="relative z-10 section-padding py-20 md:py-28">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">

          {/* ── LEFT: Copy ── */}
          <div className="flex-1 max-w-xl">

            <div data-loc-anim>
              <SectionLabel light>Prime Silicon Valley Locations</SectionLabel>
            </div>

            <h2
              data-loc-anim
              className="mt-5 font-heading text-4xl font-bold leading-tight text-white md:text-5xl lg:text-[52px]"
            >
              Steps from{' '}
              <span className="text-t2g-sand">everything</span>{' '}
              that matters.
            </h2>

            <p
              data-loc-anim
              className="mt-5 font-body text-base text-white/70 leading-relaxed md:text-lg"
            >
              Every T2G property is hand-picked in San Jose's most connected
              neighborhoods — close to tech campuses, transit, restaurants,
              and SJC Airport. No wasted commute time.
            </p>

            {/* Location pills */}
            <ul className="mt-8 flex flex-col gap-3" data-loc-anim>
              {LOCATIONS.map(({ icon: Icon, label, sub }) => (
                <li
                  key={label}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 backdrop-blur-sm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-t2g-teal/20">
                    <Icon className="h-4 w-4 text-t2g-teal" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-white">{label}</p>
                    <p className="font-body text-xs text-white/50">{sub}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Rating strip */}
            <div
              data-loc-anim
              className="mt-8 flex items-center gap-3"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-t2g-mustard text-t2g-mustard" />
                ))}
              </div>
              <span className="font-body text-sm text-white/60">4.8 · 900+ verified stays</span>
            </div>

            {/* CTA */}
            <div data-loc-anim className="mt-8">
              <Button
                as="a"
                href="/properties"
                size="lg"
                className="bg-t2g-sand text-t2g-navy hover:bg-t2g-mustard border-0"
              >
                Book Your Stay
              </Button>
            </div>
          </div>

          {/* ── RIGHT: 3-D Map ── */}
          <div
            data-loc-map
            className="relative w-full lg:flex-1 lg:max-w-[600px]"
          >
            {/* Glow ring behind the map */}
            <div className="absolute inset-0 -m-4 rounded-3xl bg-t2g-teal/10 blur-2xl" />

            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              style={{ aspectRatio: '4/3' }}
            >
              {/* Loading state */}
              {!sceneLoaded && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-t2g-navy/80">
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      border: '3px solid rgba(255,255,255,0.15)',
                      borderTopColor: '#2E8B8E',
                      borderRadius: '50%',
                      animation: 'prime-spin 0.8s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                  <p className="font-body text-xs text-white/40">Loading 3D map…</p>
                </div>
              )}

              {/*
                Crop the Spline viewer's black header/footer bars by making the
                iframe taller than its container and shifting it up by CROP_PX.
                The container's overflow-hidden clips the bars out of view.
              */}
              <iframe
                src={SPLINE_SCENE_URL}
                title="T2G Silicon Valley 3D Map"
                frameBorder="0"
                allowFullScreen
                onLoad={() => setSceneLoaded(true)}
                style={{
                  border: 'none',
                  position: 'absolute',
                  top: '-54px',
                  left: 0,
                  width: '100%',
                  height: 'calc(100% + 108px)',
                }}
              />

              {/* Badge sits inside the frame, z-20 keeps it above the iframe */}
              <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 rounded-2xl border border-white/10 bg-t2g-navy/90 px-4 py-2.5 shadow-xl backdrop-blur-md">
                <MapPin className="h-4 w-4 text-t2g-teal" />
                <span className="font-heading text-xs font-semibold text-white">San Jose, CA</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Spinner keyframes */}
      <style>{`@keyframes prime-spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
