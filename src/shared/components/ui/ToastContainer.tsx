import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore, type ToastType } from '@/shared/store/ui.store';
import { cn } from '@/shared/utils/cn';

/**
 * ToastContainer — sağ altta sabit, store'daki toast'ları render eder.
 *
 * position: fixed + bottom/right + yüksek z-index ile her sayfanın üstünde.
 * Her toast `animate-slide-up` ile kayarak gelir, `animate-fade-in` ile
 * kaybolur (kaldırma kısa yolla, timer ui.store içinde).
 *
 * Bu component state'i doğrudan store'dan alıyor — Provider yok, hook yeter.
 */

const iconMap = {
  success: CheckCircle2,
  error:   AlertCircle,
  info:    Info,
} satisfies Record<ToastType, unknown>;

const colorMap = {
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  error:   'border-red-500/40 bg-red-500/10 text-red-300',
  info:    'border-sky-500/40 bg-sky-500/10 text-sky-300',
} satisfies Record<ToastType, string>;

export function ToastContainer() {
  // Selector pattern: sadece toasts değişince re-render
  const toasts     = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => {
        const Icon = iconMap[t.type];
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-xl backdrop-blur-md min-w-[280px] max-w-sm',
              'animate-slide-up',
              colorMap[t.type],
            )}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="flex-1 text-sm text-zinc-100">{t.message}</p>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              aria-label="Kapat"
              className="shrink-0 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
