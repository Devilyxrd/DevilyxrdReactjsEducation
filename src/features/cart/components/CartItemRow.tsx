import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatTL } from '@/shared/utils/formatTL';
import { useCartStore } from '@/features/cart/store/cart.store';
import { useUIStore } from '@/shared/store/ui.store';
import type { CartItem } from '@/features/cart/types';

/**
 * CartItemRow — sepette tek bir ürün satırı.
 *
 * Adet + / - butonları store.updateQuantity'yi çağırıyor. 0 veya altına
 * inince store otomatik kaldırıyor (cart.store.ts içinde bu kontrol var).
 *
 * Trash butonu direkt removeItem çağırıyor — toast ile bilgi veriyoruz.
 */

export function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem     = useCartStore((s) => s.removeItem);
  const addToast       = useUIStore((s) => s.addToast);

  function handleRemove() {
    removeItem(item.productId);
    addToast(`${item.name} sepetten çıkarıldı`, 'info');
  }

  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 transition-colors hover:border-zinc-700">
      {/* Görsel */}
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 text-3xl">
        {item.image}
      </div>

      {/* Başlık + birim fiyat */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-zinc-100">
          {item.name}
        </h3>
        <p className="mt-0.5 text-xs text-zinc-400">
          Birim: {formatTL(item.price)}
        </p>
      </div>

      {/* Adet kontrol */}
      <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
        <button
          type="button"
          aria-label="Azalt"
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="grid h-7 w-7 place-items-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 active:scale-90"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-7 text-center text-sm font-semibold text-zinc-100">
          {item.quantity}
        </span>
        <button
          type="button"
          aria-label="Arttır"
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="grid h-7 w-7 place-items-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 active:scale-90"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Satır toplamı */}
      <div className="hidden w-24 text-right sm:block">
        <p className="text-sm font-bold text-zinc-100">{formatTL(lineTotal)}</p>
      </div>

      {/* Sil */}
      <button
        type="button"
        aria-label="Kaldır"
        onClick={handleRemove}
        className="grid h-9 w-9 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400 active:scale-90"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
