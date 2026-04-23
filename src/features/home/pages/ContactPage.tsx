import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { useUIStore } from '@/shared/store/ui.store';

/**
 * ContactPage — iletişim formu.
 *
 * Bu sayfa üç pattern'i birden gösterir:
 *
 *  1) useState ile kontrollü form — her input'un value'su state'ten gelir,
 *     onChange ile state güncellenir. Tek bir `form` objesinde toplarız.
 *
 *  2) Elle client-side validation — backend olmadığı için validation
 *     tamamen frontend'de. Gerçek projede server da doğrular (güvenlik).
 *
 *  3) Async submit simülasyonu — setTimeout ile "gönderiliyor..." state'i
 *     süresince button disabled. Bitince toast ve form temizleme.
 */

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: FormState = { name: '', email: '', subject: '', message: '' };

export default function ContactPage() {
  const [form,    setForm]    = useState<FormState>(initialForm);
  const [errors,  setErrors]  = useState<Partial<Record<keyof FormState, string>>>({});
  const [sending, setSending] = useState(false);

  const addToast = useUIStore((s) => s.addToast);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    // Kullanıcı yazmaya başlayınca eski hatayı sıfırla
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: typeof errors = {};
    if (form.name.trim().length < 2)       errs.name    = 'Adınızı girin (min 2 karakter)';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email   = 'Geçerli bir e-posta girin';
    if (form.subject.trim().length < 3)    errs.subject = 'Konu başlığı çok kısa';
    if (form.message.trim().length < 10)   errs.message = 'Mesaj en az 10 karakter olmalı';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    // Backend yok — fake latency
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);

    addToast('Mesajınız alındı, teşekkürler!', 'success');
    setForm(initialForm);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          İletişim
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-zinc-400">
          Proje ile ilgili soruların, önerilerin veya geri bildirimin için
          aşağıdaki formu kullanabilirsin.
        </p>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {/* Sol: bilgiler */}
        <div className="space-y-4 animate-slide-up">
          <InfoBlock
            icon={Mail}
            title="E-posta"
            value="hello@devilyxrd.dev"
            href="mailto:hello@devilyxrd.dev"
          />
          <InfoBlock
            icon={Phone}
            title="Telefon"
            value="+90 555 000 00 00"
            href="tel:+905550000000"
          />
          <InfoBlock
            icon={MapPin}
            title="Adres"
            value="İstanbul, Türkiye"
          />
        </div>

        {/* Sağ: form */}
        <Card className="md:col-span-2 animate-slide-up" style={{ animationDelay: '80ms' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Ad Soyad"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                error={errors.name}
                placeholder="Ahmet Yılmaz"
              />
              <Input
                label="E-posta"
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                error={errors.email}
                placeholder="ornek@mail.com"
              />
            </div>

            <Input
              label="Konu"
              value={form.subject}
              onChange={(e) => setField('subject', e.target.value)}
              error={errors.subject}
              placeholder="Teknik soru / geri bildirim"
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                Mesaj
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setField('message', e.target.value)}
                rows={5}
                placeholder="Mesajınızı buraya yazın..."
                className={
                  'w-full rounded-lg bg-zinc-900 text-zinc-100 placeholder-zinc-500 p-3 ' +
                  'border border-zinc-800 transition-all duration-200 ' +
                  'focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 ' +
                  'hover:border-zinc-700 ' +
                  (errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '')
                }
              />
              {errors.message && (
                <p className="mt-1.5 text-xs text-red-400 animate-fade-in">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                loading={sending}
                leftIcon={<Send className="h-4 w-4" />}
              >
                Gönder
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

function InfoBlock({
  icon: Icon,
  title,
  value,
  href,
}: {
  icon: typeof Mail;
  title: string;
  value: string;
  href?: string;
}) {
  const content = (
    <Card hover={Boolean(href)} className="flex items-start gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-300 ring-1 ring-brand-500/30">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {title}
        </p>
        <p className="mt-0.5 text-sm text-zinc-200">{value}</p>
      </div>
    </Card>
  );
  return href ? <a href={href}>{content}</a> : content;
}
