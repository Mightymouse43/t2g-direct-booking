import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Award, MapPin, Flame } from 'lucide-react';
import SectionLabel from '../ui/SectionLabel';
import ScannerCardStream from '../ui/ScannerCardStream';

gsap.registerPlugin(ScrollTrigger);

const TOP_REASONS = [
  {
    Icon: Award,
    title: 'Superhost Certified',
    body: "T2G holds Superhost status on Airbnb — meaning top-tier guest ratings, fast responses, and zero cancellations. You are booking with a host that has earned it.",
  },
  {
    Icon: MapPin,
    title: 'Prime Silicon Valley Locations',
    body: "Our properties are minutes from Downtown San Jose, San Jose State University, Japantown, and SJC Airport — with easy access to Adobe, Cisco, Zoom, and PayPal campuses.",
  },
];

export default function WhyT2G() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const cards = Array.from(el.querySelectorAll('.why-card'));
    if (!cards.length) return;

    // Set initial hidden state explicitly
    gsap.set(cards, { opacity: 0, y: 40 });

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.15,
        });
      },
    });

    return () => {
      st.kill();
      gsap.set(cards, { clearProps: 'all' });
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-t2g-navy section-padding section-y">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14 space-y-4">
          <SectionLabel light>Why Book Direct</SectionLabel>
          <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
            The T2G <span className="luxury-accent text-t2g-sand">Difference</span>
          </h2>
          <p className="font-body text-t2g-mist/70 max-w-xl mx-auto">
            We know Silicon Valley. Let us make your stay effortless.
          </p>
        </div>

        {/* Top two cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {TOP_REASONS.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="why-card group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-t2g-teal/20">
                <Icon className="h-6 w-6 text-t2g-teal" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-white mb-3">{title}</h3>
              <p className="font-body text-sm leading-relaxed text-t2g-mist/70">{body}</p>
            </div>
          ))}
        </div>

        {/* Single combined card: text left, scanner right */}
        <div className="why-card rounded-3xl border border-t2g-teal/30 bg-t2g-teal/10 backdrop-blur-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* Left: Stop Burning Cash text */}
            <div className="p-6 md:p-8 lg:w-2/5 shrink-0 space-y-3 lg:border-r border-t2g-teal/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-t2g-teal/20">
                <Flame className="h-5 w-5 text-t2g-teal" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                Stop Burning Cash on Unnecessary Fees
              </h3>
              <p className="font-body text-sm leading-relaxed text-t2g-mist/70">
                OTAs charge guests up to 18% in service fees on every booking — money that goes straight to a platform, not toward your stay. Book directly with T2G and keep that 15%+ in your pocket. Same home. Better price. Guaranteed.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-t2g-teal/20 px-3 py-1.5 font-heading text-xs font-semibold text-t2g-teal">
                  Save 15%+ on every stay
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-heading text-xs font-semibold text-t2g-mist/80">
                  Guaranteed lowest rate
                </span>
              </div>
            </div>

            {/* Right: Scanner stream */}
            <div className="flex-1 flex items-center">
              <ScannerCardStream initialSpeed={120} direction={-1} repeat={5} />
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
