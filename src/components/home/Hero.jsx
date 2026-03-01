import { useEffect } from 'react';
import { Star } from 'lucide-react';
import ScrollExpandMedia from '../ui/ScrollExpandMedia';

export default function Hero() {
  useEffect(() => {
    if (!document.querySelector('script[src="https://app.ownerrez.com/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://app.ownerrez.com/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/428_promo_web.mp4"
      posterSrc="/02.jpg"
      bgImageSrc="/02.jpg"
      title="Book Direct"
      date="San Jose, CA · Silicon Valley"
      scrollToExpand="↓ Scroll to explore"
    >
      {/* Branding header — dark navy */}
      <div className="bg-t2g-navy py-14 px-6 md:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-t2g-sand/70">
            Book Direct &amp; Save 15%
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            Modern. Trusted.{' '}
            <span className="luxury-accent text-t2g-sand">Silicon Valley Stays.</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto font-body text-base text-white/70 md:text-lg">
            Fully furnished vacation rentals and corporate housing in Downtown San Jose,
            Japantown, and near SJC Airport. Skip the OTA fees and book directly with T2G
            for guaranteed lowest rates.
          </p>
          {/* Social proof */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-t2g-mustard text-t2g-mustard" />
                ))}
              </div>
              <span className="font-body text-sm text-white/70">4.8 · 900+ reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src="/superhost-emblem.jpg"
                alt="Airbnb Superhost"
                className="h-7 w-auto rounded"
              />
              <span className="font-body text-sm text-white/70">Superhost Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Widget section — white so OwnerRez results are fully readable */}
      <div className="bg-white py-12 px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          <div
            className="ownerrez-widget"
            data-widget-type="Availability/Property Search Widget - Availability/Property Search"
            data-widgetId="f16eb17ab61a460baa850e04c59f28d1"
          />
        </div>
      </div>
    </ScrollExpandMedia>
  );
}
