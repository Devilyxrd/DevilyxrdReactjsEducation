import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { Button } from '@/shared/components/ui/Button';
import { OrderCard } from '@/features/orders/components/OrderCard';
import { useOrdersStore } from '@/features/orders/store/orders.store';
import { useSessionStore } from '@/features/auth/store/session.store';

/**
 * OrdersPage — giriş yapmış kullanıcının kendi siparişleri.
 *
 * ProtectedRoute altında render edildiği için user garanti var — yine de
 * güvenlik amaçlı optional chain ile koruma yapıyoruz.
 *
 * useMemo ile filtreleme — store.listByUser her render'da yeni array üretir
 * (yeni referans); yeniden hesaplamayı kendi elimizle bağımlılığa bağlıyoruz.
 */

export default function OrdersPage() {
  const user   = useSessionStore((s) => s.user);
  const orders = useOrdersStore((s) => s.orders);

  const myOrders = useMemo(
    () => (user ? orders.filter((o) => o.userId === user.id) : []),
    [orders, user],
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-12 lg:px-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          Siparişlerim
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Şu ana kadar verdiğin siparişlerin listesi.
        </p>
      </div>

      {myOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Henüz siparişin yok"
          description="Ürünler sayfasından alışverişe başla; siparişlerin burada görünür."
          action={
            <Link to="/products">
              <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                Alışverişe Başla
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {myOrders.map((order, i) => (
            <div
              key={order.id}
              className="animate-slide-up"
              style={{ animationDelay: `${Math.min(i * 60, 300)}ms` }}
            >
              <OrderCard order={order} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
