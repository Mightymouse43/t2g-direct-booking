import Hero from '../components/home/Hero';
import PrimeLocation from '../components/home/PrimeLocation';
import FeaturedProperties from '../components/home/FeaturedProperties';
import WhyT2G from '../components/home/WhyT2G';
import HowItWorks from '../components/home/HowItWorks';
import ReviewsSection from '../components/home/ReviewsSection';
import FAQSection from '../components/home/FAQSection';
import { useSEO } from '../hooks/useSEO';

const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'T2G Vacation Rentals',
  description:
    'Fully furnished vacation homes and corporate housing in San Jose, CA. Book directly and skip Airbnb & VRBO fees.',
  url: 'https://tenants2gueststays.com',
  email: 'support@tenants2guest.com',
  image: 'https://tenants2gueststays.com/og-image.jpg',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'San Jose',
    addressRegion: 'CA',
    postalCode: '95002',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 37.3382,
    longitude: -121.8863,
  },
  areaServed: { '@type': 'City', name: 'San Jose' },
  priceRange: '$$',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '900',
    bestRating: '5',
  },
};

export default function HomePage() {
  useSEO({
    title: 'Vacation Homes in San Jose, CA | T2G — Book Direct & Save',
    description:
      'Fully furnished vacation homes & corporate housing in San Jose, CA. Book directly with T2G and skip Airbnb & VRBO fees. Superhost-certified · Silicon Valley locations near Apple, Google & Meta.',
    path: '/',
    jsonLd: HOME_JSON_LD,
    jsonLdId: 'json-ld-home',
  });

  return (
    <>
      <Hero />
      <PrimeLocation />
      <HowItWorks />
      <ReviewsSection />
      <FeaturedProperties />
      <WhyT2G />
      <FAQSection />
    </>
  );
}
