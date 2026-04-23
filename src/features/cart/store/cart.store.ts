import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/features/cart/types';

/**
 * Cart Store — sepet yönetimi.
 *
 * persist middleware ile localStorage'a yazılır; kullanıcı sekme kapatsa
 * bile sepet kalır (misafir modu). Login gerektirmiyor.
 *
 * `addItem` aynı productId zaten sepettedyse adedi artırır, değilse yeni
 * kalem ekler. Bu idempotent davranış UX'te önemli: "Sepete ekle"ye 3 kez
 * basmak 3 ayrı satır değil, adet=3 olmalı.
 *
 * Total hesaplamaları fonksiyon şeklinde çünkü kaleme her girişte yeniden
 * hesaplanıp state'te tutulması yerine ihtiyaç anında hesaplamak daha
 * temiz (derived state).
 */

type CartState = {
  items: CartItem[];

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clear: () => void;

  // Derived
  total: () => number;
  itemCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + qty }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        }),

      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),

      updateQuantity: (productId, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.productId !== productId)
              : s.items.map((i) =>
                  i.productId === productId ? { ...i, quantity: qty } : i,
                ),
        })),

      clear: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'cart-storage' },
  ),
);
