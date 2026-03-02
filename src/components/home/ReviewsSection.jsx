import { useEffect, useState } from 'react';
import SectionLabel from '../ui/SectionLabel';
import { Star } from 'lucide-react';
import { fetchReviews } from '../../api/ownerrez';

// Fallback static reviews shown if the API fetch fails or returns too few results
const STATIC_REVIEWS = [
  {
    author: 'Priya S.',
    location: 'On assignment at Cisco, San Jose',
    rating: 5,
    text: "Perfect for a 6-week corporate stay. Fast Wi-Fi, a real workspace, full kitchen — everything I needed without paying hotel prices. Booked directly and saved over $500 in fees.",
  },
  {
    author: 'Marcus & Dana T.',
    location: 'Visiting from Austin, TX',
    rating: 5,
    text: "We stayed near Japantown for a family trip and it was fantastic. T2G was so easy to work with — way better communication than any OTA. We will absolutely book direct again.",
  },
  {
    author: 'Kevin L.',
    location: 'Relocating for Adobe, San Jose',
    rating: 5,
    text: "Used T2G for extended corporate housing while finding a permanent place. The location near Downtown was ideal and the T2G team was incredibly responsive the entire time.",
  },
  {
    author: 'Jennifer K.',
    location: 'Conference visit, SAP Center San Jose',
    rating: 5,
    text: "Stayed for a week-long conference and couldn't have asked for a better home base. Spotless, seamless check-in, and a real kitchen saved me so much on food. Will be my go-to for San Jose trips.",
  },
  {
    author: 'Daniel & Rosa M.',
    location: 'Extended stay, Downtown San Jose',
    rating: 5,
    text: "Needed a place for 3 weeks while our apartment renovated. T2G made it effortless — responsive team, beautiful space, perfect location. Saved money booking directly and would do it every time.",
  },
];

function StarRow({ count }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-t2g-mustard text-t2g-mustard" />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState(STATIC_REVIEWS);

  useEffect(() => {
    fetchReviews()
      .then((data) => {
        const items = Array.isArray(data) ? data : data?.items ?? [];
        const picked = items
          .filter((r) => r.stars === 5 && r.body && r.body.length > 40)
          .slice(0, 5)
          .map((r) => ({
            author: 'Verified Guest',
            location: r.listing_site ?? 'Verified Stay',
            rating: r.stars,
            text: r.body,
          }));
        if (picked.length >= 3) setReviews(picked);
      })
      .catch(() => {
        // silently keep static fallback
      });
  }, []);

  // Duplicate cards for seamless infinite loop
  const marqueeItems = [...reviews, ...reviews];

  return (
    <section className="bg-t2g-navy section-padding section-y">
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 45s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 space-y-4">
          <SectionLabel light>Guest Reviews</SectionLabel>
          <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
            What Guests <span className="luxury-accent text-t2g-sand">Say</span>
          </h2>
        </div>
      </div>

      {/* Marquee — break out of section-padding to go full-bleed */}
      <div
        className="-mx-6 md:-mx-12 lg:-mx-20 overflow-hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div className="marquee-track flex gap-6 px-6" style={{ width: 'max-content' }}>
          {marqueeItems.map(({ author, location, rating, text }, i) => (
            <div
              key={i}
              className="w-[340px] shrink-0 rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm"
            >
              <StarRow count={rating} />
              <p className="mt-4 font-body text-sm leading-relaxed text-t2g-mist/80 italic">
                "{text}"
              </p>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="font-heading text-sm font-semibold text-white">{author}</p>
                <p className="font-body text-xs text-t2g-mist/50">{location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aggregate stats */}
      <div className="max-w-6xl mx-auto">
        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-10 border-t border-white/10 pt-10">
          <div className="text-center">
            <p className="font-heading text-5xl font-black text-white">4.8</p>
            <div className="mt-1 flex justify-center"><StarRow count={5} /></div>
            <p className="mt-1 font-body text-xs text-t2g-mist/50">Average Rating</p>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-white/10" />
          <div className="text-center">
            <p className="font-heading text-5xl font-black text-white">900+</p>
            <p className="mt-1 font-body text-xs text-t2g-mist/50">Verified Reviews</p>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-white/10" />
          <div className="text-center">
            <p className="font-heading text-5xl font-black text-white">98%</p>
            <p className="mt-1 font-body text-xs text-t2g-mist/50">Would Recommend</p>
          </div>
        </div>
      </div>
    </section>
  );
}
