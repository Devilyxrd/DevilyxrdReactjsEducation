import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

/**
 * Button — projenin her yerinde kullanılan tek tip button.
 *
 * Variant/size prop'larına göre Tailwind class'larını seçiyoruz.
 * `disabled:opacity-50 disabled:cursor-not-allowed` ile disabled durumunu UX'e
 * yansıtıyoruz. `active:scale-[0.98]` ve `hover:` class'ları tıklama / fare
 * ile etkileşim hissini güçlendiriyor — tasarımda animasyon/hover önemli.
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40',
  secondary:
    'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-100 border border-zinc-700',
  ghost:
    'bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100',
  danger:
    'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-lg shadow-red-600/20',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8  px-3 text-xs  gap-1.5 rounded-md',
  md: 'h-10 px-4 text-sm  gap-2   rounded-lg',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading,
  fullWidth,
  className,
  children,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        // Temel stil + erişilebilirlik için focus ring
        'inline-flex items-center justify-center font-medium',
        'transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
        'active:scale-[0.98]',                                        // hafif "basıldı" hissi
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          Yükleniyor...
        </span>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}
