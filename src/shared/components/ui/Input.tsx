import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

/**
 * Input — label + error destekli kontrollü input.
 *
 * forwardRef kullanıyoruz çünkü form kütüphaneleri veya focus yönetimi
 * çoğu zaman input'un DOM node'una ref ile erişmek ister.
 *
 * Error varsa border kırmızı + küçük bir hata mesajı. leftIcon opsiyonel
 * — Lucide icon'u ile beraber kullanılacak (örn. Mail, Lock).
 */

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, leftIcon, hint, className, id, ...rest },
  ref,
) {
  // id yoksa label<->input eşleşmesi için otomatik üret
  const autoId = id ?? `input-${rest.name ?? Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={autoId}
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {leftIcon}
          </span>
        )}

        <input
          {...rest}
          id={autoId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          className={cn(
            'w-full h-11 rounded-lg bg-zinc-900 text-zinc-100 placeholder-zinc-500',
            'border border-zinc-800 transition-all duration-200',
            'focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20',
            'hover:border-zinc-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            leftIcon ? 'pl-10 pr-3' : 'px-3',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
        />
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-red-400 animate-fade-in">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
});
