import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { formatTL } from '@/shared/utils/formatTL';
import { useCartStore } from '@/features/cart/store/cart.store';
import { useUIStore } from '@/shared/store/ui.store';
import { CartItemRow } from '@/features/cart/components/CartItemRow';

/**
 * CartPage — sepet sayfası.
 *
 * Tamamen store'a bağlı, kendi state'i yok. Pattern vurgusu:
 *   - Tek bir store'dan birden fazla selector çağrılıyor. Bu önemli:
 *     Zustand her selector'u ayrı ayrı karşılaştırır; sadece gerçekten
 *     değişen parça re-render tetikler.
 *   - `total()` ve `itemCount()` derived state — store'da getter.
 *   - 500 TL üzeri ücretsiz kargo — UI'da basit bir threshold hesabı.
 */

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 49;

export default function CartPage() {
  const items     = useCartStore((s) => s.items);
  const total     = useCartStore((s) => s.total());
  const itemCount = useCartStore((s) => s.itemCount());
  const clear     = useCartStore((s) => s.clear);
  const addToast  = useUIStore((s) => s.addToast);

  const hasItems      = items.length > 0;
  const freeShipping  = total >= FREE_SHIPPING_THRESHOLD;
  const shippingFee   = freeShipping || !hasItems ? 0 : SHIPPING_FEE;
  const grandTotal    = total + shippingFee;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - total);

  function handleClear() {
    if (!hasItems) return;
    clear();
    addToast('Sepet temizlendi', 'info');
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-12 lg:px-8">
      <div className="mb-8 flex items-end justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Sepetim
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {hasItems
              ? `${itemCount} ürün, toplam ${formatTL(total)}`
              : 'Sepetin şu an boş.'}
          </p>
        </div>

        {hasItems && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
          >
            Temizle
          </Button>
        )}
      </div>

      {!hasItems ? (
        <EmptyState
          icon={ShoppingCart}
          title="Sepetin boş"
          description="Ürünler sayfasına göz at ve beğendiklerini buraya ekle."
          action={
            <Link to="/products">
              <Button leftIcon={<ArrowRight className="h-4 w-4" />}>
                Ürünleri Keşfet
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          {/* Sol — kalemler */}
          <div className="space-y-3">
            {items.map((item, i) => (
              <div
                key={item.productId}
                className="animate-slide-up"
                style={{ animationDelay: `${Math.min(i * 40, 200)}ms` }}
              >
                <CartItemRow item={item} />
              </div>
            ))}

            {/* Free shipping progress */}
            <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 animate-fade-in">
              {freeShipping ? (
                <p className="text-sm text-emerald-400">
                  🎉 Ücretsiz kargo kazandın!
                </p>
              ) : (
                <>
                  <p className="text-sm text-zinc-300">
                    Ücretsiz kargo için{' '}
                    <span className="font-semibold text-brand-300">
                      {formatTL(remainingForFree)}
                    </span>{' '}
                    daha ekle.
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sağ — özet */}
          <Card className="h-fit sticky top-20">
            <h3 className="text-base font-semibold text-zinc-100">Sipariş Özeti</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-400">Ara Toplam</dt>
                <dd className="font-medium text-zinc-100">{formatTL(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-400">Kargo</dt>
                <dd className="font-medium text-zinc-100">
                  {freeShipping ? (
                    <span className="text-emerald-400">Ücretsiz</span>
                  ) : (
                    formatTL(shippingFee)
                  )}
                </dd>
              </div>
              <div className="mt-3 border-t border-zinc-800 pt-3 flex justify-between">
                <dt className="text-base font-semibold text-zinc-100">Toplam</dt>
                <dd className="text-base font-bold text-brand-300">{formatTL(grandTotal)}</dd>
              </div>
            </dl>

            <Link to="/checkout" className="mt-5 block">
              <Button fullWidth size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Ödemeye Geç
              </Button>
            </Link>

            <p className="mt-3 text-center text-xs text-zinc-500">
              Ödeme için üye olmana gerek var.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
