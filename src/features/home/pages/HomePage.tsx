import { HeroSection } from '@/features/home/components/HeroSection';
import { FeatureGrid } from '@/features/home/components/FeatureGrid';
import { FeaturedProducts } from '@/features/home/components/FeaturedProducts';

/**
 * HomePage — anasayfa. Sadece section'ları üst üste koyar.
 * Tüm mantık component'ların içinde — HomePage sadece "kompozisyon" yapar.
 * Sayfa seviyesinde mantık olmadığı için state yok.
 */

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <FeatureGrid />
    </>
  );
}
