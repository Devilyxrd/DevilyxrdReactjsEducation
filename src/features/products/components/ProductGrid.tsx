import type { Product } from '@/features/products/types';
import { ProductCard } from './ProductCard';

/**
 * ProductGrid — responsive ürün grid'i.
 * Mobile 2 kolon → tablet 3 → desktop 4. Staggered animation için her
 * kartı ayrı animation-delay ile fade-in ediyoruz (index bazlı).
 */

type Props = { products: Product[] };

export function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {products.map((p, i) => (
        <div
          key={p.id}
          className="animate-slide-up"
          style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
        >
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
