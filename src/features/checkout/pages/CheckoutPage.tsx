import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User2, Phone, MapPin, StickyNote, CreditCard, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { formatTL } from '@/shared/utils/formatTL';
import { useCartStore } from '@/features/cart/store/cart.store';
import { useSessionStore } from '@/features/auth/store/session.store';
import { useOrdersStore } from '@/features/orders/store/orders.store';
import { useUIStore } from '@/shared/store/ui.store';

/**
 * CheckoutPage — ödeme / sipariş tamamlama.
 *
 * Auth ProtectedRoute tarafından zorunlu tutuluyor. Burada gelen user
 * her zaman var.
 *
 * Akış:
 *   1) Kullanıcı teslimat bilgilerini doldurur.
 *   2) "Siparişi Tamamla" → validate → ordersStore.createOrder → cart.clear
 *   3) "Sipariş oluşturuldu" ekranı 2 sn görünür → /orders sayfasına yönlendir.
 *
 * Backend yok — createOrder senkron. Gerçek projede API çağrısı async olur,
 * loading state + error path gerekir.
 */

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 49;

type ShippingForm = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  note: string;
};

export default function CheckoutPage() {
  const user        = useSessionStore((s) => s.user);
  const items       = useCartStore((s) => s.items);
  const subtotal    = useCartStore((s) => s.total());
  const clearCart   = useCartStore((s) => s.clear);
  const createOrder = useOrdersStore((s) => s.createOrder);
  const addToast    = useUIStore((s) => s.addToast);
  const navigate    = useNavigate();

  const [form, setForm] = useState<ShippingForm>({
    fullName: user?.name ?? '',
    phone: '',
    address: '',
    city: '',
    note: '',
  });
  const [errors, setErrors]   = useState<Partial<Record<keyof ShippingForm, string>>>({});
  const [placing, setPlacing] = useState(false);
  const [placed,  setPlaced]  = useState(false);

  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee  = freeShipping ? 0 : SHIPPING_FEE;
  const total        = subtotal + shippingFee;

  function setField<K extends keyof ShippingForm>(key: K, value: ShippingForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: typeof errors = {};
    if (form.fullName.trim().length < 2)                  errs.fullName = 'Ad Soyad girin';
    if (!/^[\d\s()+-]{10,}$/.test(form.phone))            errs.phone    = 'Geçerli telefon girin';
    if (form.address.trim().length < 10)                  errs.address  = 'Adres en az 10 karakter';
    if (form.city.trim().length < 2)                      errs.city     = 'Şehir girin';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !user) return;

    setPlacing(true);
    // Fake gecikme — ödeme akışı gibi hissetsin
    await new Promise((r) => setTimeout(r, 800));

    createOrder({
      userId: user.id,
      items: items.slice(),              // snapshot — sonra sepet temizlenecek
      subtotal,
      shippingFee,
      total,
      shipping: {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        note: form.note || undefined,
      },
    });

    clearCart();
    setPlacing(false);
    setPlaced(true);
    addToast('Sipariş oluşturuldu!', 'success');

    setTimeout(() => navigate('/orders'), 2000);
  }

  // Sepet boşsa checkout yapılamaz
  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-xl py-20">
        <EmptyState
          icon={CreditCard}
          title="Ödeme yapılacak ürün yok"
          description="Önce sepetine bir şeyler ekle."
          action={
            <Link to="/products">
              <Button>Ürünlere Git</Button>
            </Link>
          }
        />
      </div>
    );
  }

  // Sipariş tamamlandı ekranı
  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center animate-scale-in">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/10 ring-4 ring-emerald-500/20">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-zinc-100">
          Sipariş oluşturuldu!
        </h1>
        <p className="mt-2 text-zinc-400">
          Siparişinin detaylarını "Siparişlerim" sayfasında takip edebilirsin.
        </p>
        <p className="mt-6 text-xs text-zinc-500">Yönlendiriliyor...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-12 lg:px-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          Ödeme
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Teslimat bilgilerini doldur ve siparişini tamamla.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-[1fr_360px]">
        {/* Sol — form */}
        <Card className="space-y-4">
          <h2 className="text-base font-semibold text-zinc-100">Teslimat Bilgileri</h2>

          <Input
            label="Ad Soyad"
            value={form.fullName}
            onChange={(e) => setField('fullName', e.target.value)}
            error={errors.fullName}
            leftIcon={<User2 className="h-4 w-4" />}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Telefon"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              error={errors.phone}
              leftIcon={<Phone className="h-4 w-4" />}
              placeholder="+90 5XX XXX XX XX"
              required
              hint="Kurye için zorunlu"
            />
            <Input
              label="Şehir"
              value={form.city}
              onChange={(e) => setField('city', e.target.value)}
              error={errors.city}
              leftIcon={<MapPin className="h-4 w-4" />}
              placeholder="İstanbul"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">
              Adres
            </label>
            <textarea
              value={form.address}
              onChange={(e) => setField('address', e.target.value)}
              rows={3}
              placeholder="Mahalle, sokak, kapı no"
              className={
                'w-full rounded-lg bg-zinc-900 text-zinc-100 placeholder-zinc-500 p-3 ' +
                'border border-zinc-800 transition-all duration-200 ' +
                'focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 ' +
                'hover:border-zinc-700 ' +
                (errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '')
              }
            />
            {errors.address && (
              <p className="mt-1.5 text-xs text-red-400 animate-fade-in">
                {errors.address}
              </p>
            )}
          </div>

          <Input
            label="Sipariş Notu (opsiyonel)"
            value={form.note}
            onChange={(e) => setField('note', e.target.value)}
            leftIcon={<StickyNote className="h-4 w-4" />}
            placeholder="Kapıcıya bırak, zili çalma..."
          />
        </Card>

        {/* Sağ — özet */}
        <Card className="h-fit sticky top-20">
          <h3 className="text-base font-semibold text-zinc-100">Sipariş Özeti</h3>

          <div className="mt-4 max-h-52 space-y-2 overflow-y-auto pr-1">
            {items.map((it) => (
              <div key={it.productId} className="flex items-center gap-2 text-sm">
                <span className="text-lg">{it.image}</span>
                <span className="flex-1 truncate text-zinc-300">{it.name}</span>
                <span className="text-zinc-500">×{it.quantity}</span>
                <span className="w-20 text-right font-medium text-zinc-100">
                  {formatTL(it.price * it.quantity)}
                </span>
              </div>
            ))}
          </div>

          <dl className="mt-4 space-y-2 border-t border-zinc-800 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-400">Ara Toplam</dt>
              <dd className="text-zinc-100">{formatTL(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-400">Kargo</dt>
              <dd className="text-zinc-100">
                {freeShipping ? (
                  <span className="text-emerald-400">Ücretsiz</span>
                ) : (
                  formatTL(shippingFee)
                )}
              </dd>
            </div>
            <div className="mt-3 flex justify-between border-t border-zinc-800 pt-3">
              <dt className="text-base font-semibold text-zinc-100">Toplam</dt>
              <dd className="text-base font-bold text-brand-300">
                {formatTL(total)}
              </dd>
            </div>
          </dl>

          <Button
            type="submit"
            fullWidth
            size="lg"
            className="mt-5"
            loading={placing}
            leftIcon={<CreditCard className="h-4 w-4" />}
          >
            Siparişi Tamamla
          </Button>

          <p className="mt-3 text-center text-xs text-zinc-500">
            Bu bir demo — gerçek ödeme alınmaz.
          </p>
        </Card>
      </form>
    </div>
  );
}
