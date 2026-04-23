import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * AuthCard — login / register / forgot-password sayfalarının ortak kutusu.
 *
 * 3 ayrı sayfa da aynı görsel iskelete sahip: centered card + logo +
 * başlık + alt yazı + form. DRY kuralı gereği tek bileşende topladık.
 *
 * Arka plana radial gradient + blur topları koyduk (home hero'yla uyumlu).
 */

type Props = {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
};

export function AuthCard({ title, description, footer, children }: Props) {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      {/* Arka plan süsü */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15),transparent_60%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/40">
              <ShoppingBag className="h-5 w-5 text-white" />
            </span>
            <span className="text-xl font-bold text-zinc-100">Devilyxrd</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm text-zinc-400">{description}</p>
            )}
          </div>

          {children}

          {footer && (
            <div className="mt-6 text-center text-sm text-zinc-400">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
