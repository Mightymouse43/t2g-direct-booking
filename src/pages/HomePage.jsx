import Hero from '../components/home/Hero';
import PrimeLocation from '../components/home/PrimeLocation';
import FeaturedProperties from '../components/home/FeaturedProperties';
import WhyT2G from '../components/home/WhyT2G';
import HowItWorks from '../components/home/HowItWorks';
import ReviewsSection from '../components/home/ReviewsSection';
import FAQSection from '../components/home/FAQSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PrimeLocation />
      <FeaturedProperties />
      <WhyT2G />
      <HowItWorks />
      <ReviewsSection />
      <FAQSection />
    </>
  );
}
