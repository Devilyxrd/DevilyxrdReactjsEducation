import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

/**
 * Badge — küçük durum rozeti. Sipariş status, kategori etiketi vs.
 */

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

type Props = HTMLAttributes<HTMLSpanElement> & { variant?: Variant };

const variantClasses: Record<Variant, string> = {
  default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  danger:  'bg-red-500/10 text-red-400 border-red-500/30',
  info:    'bg-sky-500/10 text-sky-400 border-sky-500/30',
  brand:   'bg-brand-500/10 text-brand-300 border-brand-500/40',
};

export function Badge({ variant = 'default', className, children, ...rest }: Props) {
  return (
    <span
      {...rest}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
