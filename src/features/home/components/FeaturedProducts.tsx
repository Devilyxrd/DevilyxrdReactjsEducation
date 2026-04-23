import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Spinner } from '@/shared/components/ui/Spinner';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { fetchFeaturedProducts } from '@/features/products/data/products.mock';
import type { Product } from '@/features/products/types';

/**
 * FeaturedProducts — anasayfaya konulan "öne çıkan ürünler" şeridi.
 *
 * useEffect + useState ile asenkron veri yükleme klasik örneği. Yükleme
 * sırasında Spinner, tamamlanınca grid. cancelled flag'i unmount durumunda
 * setState çağrısını engelliyor.
 */

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchFeaturedProducts().then((data) => {
      if (!cancelled) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            Öne Çıkan Ürünler
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Şu an en çok tercih edilenler.
          </p>
        </div>
        <Link
          to="/products"
          className="group inline-flex items-center gap-1 text-sm font-medium text-brand-300 transition-colors hover:text-brand-200"
        >
          Tümünü gör
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  );
}
