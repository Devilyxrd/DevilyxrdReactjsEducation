import { Code2, Boxes, Rocket, BookOpen } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';

/**
 * AboutPage — statik içerik sayfası.
 *
 * Bu rehberin neden yapıldığını, hangi teknolojileri kapsadığını anlatır.
 * Hiç store, hook veya fetch yok — tamamen sunum.
 */

const stack = [
  { name: 'React 19',     desc: 'Modern functional component + hooks', icon: Code2 },
  { name: 'Vite',         desc: 'Ultra hızlı dev + HMR',                icon: Rocket },
  { name: 'TypeScript',   desc: 'Tip güvenli geliştirme',               icon: BookOpen },
  { name: 'Zustand',      desc: 'Tüm global state',                     icon: Boxes },
];

const principles = [
  'Her satır kod yorum satırıyla açıklanmıştır.',
  'Tüm state Zustand ile yönetilir — Redux Toolkit ileri seviye bir adım.',
  'Feature-based klasör yapısı: her feature kendi içinde.',
  'useState + useEffect pattern\'leri defalarca, bilinçli tekrar edilir.',
  'Backend yok; API çağrıları mock + setTimeout ile simüle edilir.',
  'Tamamen dark theme; erişilebilirlik (reduced-motion) desteği var.',
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          Hakkımızda
        </h1>
        <p className="mt-3 text-lg text-zinc-400">
          Bu proje, React'e başlamış ama orta seviyeye nasıl geçeceğini bilmeyen
          geliştiriciler için hazırlandı. Gerçek bir e-ticaret SPA'ın tüm
          parçalarını — login, sepet, sipariş, ödeme — <strong>bir arada</strong> görmeni
          sağlar.
        </p>
      </div>

      {/* Teknoloji kartları */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-100">Kullanılan Teknolojiler</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stack.map((s, i) => (
            <Card
              key={s.name}
              hover
              className="text-center animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-brand-500/10 text-brand-300 ring-1 ring-brand-500/30">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-100">{s.name}</h3>
              <p className="mt-1 text-xs text-zinc-400">{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Prensipler */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-100">Prensiplerimiz</h2>
        <ul className="mt-5 space-y-3">
          {principles.map((p, i) => (
            <li
              key={p}
              className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 transition-colors hover:border-brand-500/40 animate-slide-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-300">
                {i + 1}
              </span>
              <span className="text-sm text-zinc-300">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
