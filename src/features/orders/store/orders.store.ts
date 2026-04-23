import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/features/cart/types';

/**
 * Orders Store — kullanıcı siparişleri.
 *
 * Checkout tamamlanınca sepet kalemleri buraya "dondurularak" geçer
 * (sipariş anındaki fiyat/adet sabit kalır). Siparişlerim sayfasında
 * kart olarak listelenir.
 *
 * Gerçek projede bu endpoint'ten gelir; burada mock için localStorage'ta
 * tutuyoruz. userId'ye göre filtreliyoruz ki farklı user'lar ayrı siparişleri
 * görsün.
 */

export type OrderStatus = 'pending' | 'preparing' | 'shipped' | 'delivered';

export type ShippingInfo = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
};

export type Order = {
  id: string;
  userId: string;
  createdAt: string;                // ISO date
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  shipping: ShippingInfo;
};

type OrdersState = {
  orders: Order[];

  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  listByUser: (userId: string) => Order[];
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (payload) => {
        const order: Order = {
          ...payload,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          status: 'pending',
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },

      listByUser: (userId) =>
        get().orders.filter((o) => o.userId === userId),
    }),
    { name: 'orders-storage' },
  ),
);
