import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * HeroSection — anasayfanın üst dev banner'ı.
 *
 * Sadece sunum + CTA. Dinamik state yok. Arka planda radial gradient
 * + üste blur'lu renk topları ile katmanlı bir görsel hissi.
 *
 * Tüm çocukları `animate-slide-up` ile sırayla görünür kılıyoruz
 * (staggered entrance — animation-delay'ler style prop üzerinden).
 */

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-900">
      {/* Arka plan: gradient + blur topları */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.25),transparent_60%)]" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300 animate-slide-up"
            style={{ animationDelay: '0ms' }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Junior → Mid level React eğitim projesi
          </div>

          <h1
            className="mt-6 text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl animate-slide-up"
            style={{ animationDelay: '80ms' }}
          >
            Modern e-ticaret hissi,{' '}
            <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-fuchsia-400 bg-clip-text text-transparent">
              sıfır backend karmaşası
            </span>
          </h1>

          <p
            className="mt-6 max-w-2xl text-lg text-zinc-400 animate-slide-up"
            style={{ animationDelay: '160ms' }}
          >
            Tamamı React + Zustand ile kurulu — login'den checkout'a,
            sepet yönetiminden session persist'e kadar her şey eğitim
            amaçlı, yorum satırlarıyla açıklanmış.
          </p>

          <div
            className="mt-8 flex flex-wrap gap-3 animate-slide-up"
            style={{ animationDelay: '240ms' }}
          >
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all duration-200 hover:bg-brand-600 hover:shadow-brand-500/50 active:scale-95"
            >
              Ürünleri Keşfet
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-6 py-3 text-sm font-semibold text-zinc-200 backdrop-blur-sm transition-all duration-200 hover:border-brand-500/50 hover:text-zinc-100 active:scale-95"
            >
              Nasıl çalışıyor?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
