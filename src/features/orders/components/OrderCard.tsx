import { Package, MapPin, Calendar } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import { Card } from '@/shared/components/ui/Card';
import { formatTL } from '@/shared/utils/formatTL';
import type { Order, OrderStatus } from '@/features/orders/store/orders.store';

/**
 * OrderCard — siparişlerim sayfasında tek bir sipariş kartı.
 * Status'e göre Badge renkleri değişiyor.
 */

const statusLabels: Record<OrderStatus, { label: string; variant: 'warning' | 'info' | 'brand' | 'success' }> = {
  pending:    { label: 'Onay Bekliyor', variant: 'warning' },
  preparing:  { label: 'Hazırlanıyor',  variant: 'info' },
  shipped:    { label: 'Kargoda',       variant: 'brand' },
  delivered:  { label: 'Teslim Edildi', variant: 'success' },
};

export function OrderCard({ order }: { order: Order }) {
  const status = statusLabels[order.status];
  const date = new Date(order.createdAt);

  return (
    <Card className="space-y-4">
      {/* Üst şerit: id + status + tarih */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Sipariş No
          </p>
          <p className="mt-0.5 font-mono text-sm text-zinc-200">
            #{order.id.slice(0, 8)}
          </p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Calendar className="h-3.5 w-3.5" />
          {date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>

      {/* Kalemler */}
      <div className="space-y-2">
        {order.items.map((it) => (
          <div key={it.productId} className="flex items-center gap-3 text-sm">
            <span className="text-xl">{it.image}</span>
            <span className="flex-1 truncate text-zinc-200">{it.name}</span>
            <span className="text-zinc-400">×{it.quantity}</span>
            <span className="w-20 text-right font-medium text-zinc-100">
              {formatTL(it.price * it.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Teslimat + toplam */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-t border-zinc-800 pt-4">
        <div className="flex items-start gap-2 text-xs text-zinc-400">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <div>
            <p className="font-medium text-zinc-300">{order.shipping.fullName}</p>
            <p>{order.shipping.address}, {order.shipping.city}</p>
            <p className="mt-0.5">Tel: {order.shipping.phone}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-zinc-500">
            Ara: {formatTL(order.subtotal)} · Kargo:{' '}
            {order.shippingFee === 0 ? 'Ücretsiz' : formatTL(order.shippingFee)}
          </p>
          <p className="mt-1 flex items-center gap-2 justify-end">
            <Package className="h-4 w-4 text-brand-400" />
            <span className="text-lg font-bold text-brand-300">
              {formatTL(order.total)}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}
