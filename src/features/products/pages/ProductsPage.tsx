import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, PackageX } from 'lucide-react';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Input } from '@/shared/components/ui/Input';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import {
  categories,
  fetchProducts,
} from '@/features/products/data/products.mock';
import type { Category, Product } from '@/features/products/types';
import { cn } from '@/shared/utils/cn';

/**
 * ProductsPage — ürün listesi + kategori filtresi + arama.
 *
 * Burada öğrenmen gereken pattern'ler:
 *
 *  1) useEffect ile mock API çağrısı — mount'ta fetchProducts() çağrılır,
 *     loading true → false geçişi takip edilir. `cancelled` flag'i component
 *     unmount olursa stale state yazımını engeller (race condition koruması).
 *
 *  2) useState ile UI-local state: query (arama), activeCategory (filtre).
 *     Bunlar URL'e bağlı değil; sayfa yenilenince sıfırlanır. İstenirse
 *     React Router `useSearchParams` ile URL'e bağlanabilir.
 *
 *  3) useDebounce — her tuş basışında filtrelemeyi rerun etmemek için
 *     300ms bekleme. Data küçükken fark etmez, ama alışkanlık edin.
 *
 *  4) useMemo — filtreleme her render'da yeniden yapılmasın, sadece
 *     bağımlılıklar değişince. `products`, `debouncedQuery`, `activeCategory`.
 */

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const [query,          setQuery]          = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const debouncedQuery = useDebounce(query, 250);

  // Mock API'den ürünleri çek — component mount olduğunda 1 kere
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    fetchProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // Derived — filtrelenmiş liste
  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    return products.filter((p) => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, debouncedQuery, activeCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Başlık */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          Ürünler
        </h1>
        <p className="mt-2 text-zinc-400">
          Kategori seçerek ya da arama kutusunu kullanarak filtreleyebilirsin.
        </p>
      </div>

      {/* Filtre barı */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="md:w-80">
          <Input
            placeholder="Ürün ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex-1 flex flex-wrap gap-2">
          <CategoryPill
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            label="Tümü"
            emoji="✨"
          />
          {categories.map((c) => (
            <CategoryPill
              key={c.value}
              active={activeCategory === c.value}
              onClick={() => setActiveCategory(c.value)}
              label={c.label}
              emoji={c.emoji}
            />
          ))}
        </div>
      </div>

      {/* Sonuç sayacı */}
      {!loading && !error && (
        <p className="mb-4 text-sm text-zinc-500">
          <Filter className="inline h-3.5 w-3.5 mr-1" />
          {filtered.length} ürün listeleniyor
        </p>
      )}

      {/* İçerik — 4 durum: loading, error, empty, data */}
      {loading ? (
        <div className="py-24 text-center">
          <Spinner size="lg" />
          <p className="mt-3 text-sm text-zinc-500">Ürünler yükleniyor...</p>
        </div>
      ) : error ? (
        <EmptyState
          icon={PackageX}
          title="Bir şeyler ters gitti"
          description={error}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={PackageX}
          title="Ürün bulunamadı"
          description="Arama kriterlerini değiştirmeyi dene."
        />
      ) : (
        <ProductGrid products={filtered} />
      )}
    </div>
  );
}

function CategoryPill({
  active,
  onClick,
  label,
  emoji,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  emoji: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
          : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-brand-500/50 hover:text-brand-300',
      )}
    >
      <span>{emoji}</span>
      {label}
    </button>
  );
}
