import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  User2,
  LogOut,
  Menu,
  X,
  Package,
} from 'lucide-react';
import { useSessionStore } from '@/features/auth/store/session.store';
import { useCartStore } from '@/features/cart/store/cart.store';
import { useUIStore } from '@/shared/store/ui.store';
import { authService } from '@/features/auth/services/auth.service';
import { cn } from '@/shared/utils/cn';

/**
 * Navbar — üst menü.
 *
 * Gözleyeceğin pattern'ler:
 *
 *  1) useState + useEffect ile scroll dinleniyor — yukarıdayken şeffaf,
 *     biraz aşağıya ininceye kadar blur + border beliriyor. useEffect
 *     cleanup'ı event listener'ı mutlaka kaldırıyor.
 *
 *  2) useState ile mobil menü aç/kapa. Masaüstünde gizli (lg: breakpoint
 *     ile inline linkler var).
 *
 *  3) Session store'dan user ve cart store'dan itemCount selector
 *     pattern'i ile çekiliyor: `useStore(s => s.x)` — sadece `x`
 *     değişince re-render.
 *
 *  4) Logout: mock API → session.logout() → toast → anasayfaya yönlendir.
 */

const navLinks = [
  { to: '/',          label: 'Anasayfa' },
  { to: '/products',  label: 'Ürünler' },
  { to: '/about',     label: 'Hakkımızda' },
  { to: '/contact',   label: 'İletişim' },
];

export function Navbar() {
  const user      = useSessionStore((s) => s.user);
  const logoutFn  = useSessionStore((s) => s.logout);
  const itemCount = useCartStore((s) => s.itemCount());
  const addToast  = useUIStore((s) => s.addToast);
  const navigate  = useNavigate();

  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Scroll izleme — useEffect + cleanup tipik örneği
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();                                // mount'ta da bir kere hesapla
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Route değişince mobile menu kapansın (kullanıcı linke tıkladıktan sonra)
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [user]);

  async function handleLogout() {
    await authService.logout();
    logoutFn();
    addToast('Çıkış yapıldı', 'info');
    navigate('/');
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800'
          : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
            <ShoppingBag className="h-4.5 w-4.5 text-white" />
          </span>
          <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Devilyxrd
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'text-brand-300'
                    : 'text-zinc-300 hover:text-zinc-100',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand-400 animate-fade-in" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right cluster: cart + user */}
        <div className="flex items-center gap-2">
          {/* Cart icon + badge */}
          <Link
            to="/cart"
            aria-label="Sepet"
            className="relative grid h-10 w-10 place-items-center rounded-lg text-zinc-300 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-100 active:scale-95"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span
                key={itemCount}                  // key değişince animasyon tekrar tetiklenir
                className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-brand-500/40 animate-scale-in"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {/* User area */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm text-zinc-200 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all duration-200"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-500/20 text-brand-300">
                  <User2 className="h-3.5 w-3.5" />
                </span>
                <span className="hidden max-w-[120px] truncate sm:block">
                  {user.name}
                </span>
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-800 bg-zinc-900 p-1 shadow-xl animate-slide-down"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <Link
                    to="/orders"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Package className="h-4 w-4" /> Siparişlerim
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Çıkış
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand-500/20 transition-all duration-200 hover:bg-brand-600 hover:shadow-brand-500/40 active:scale-95 sm:flex"
            >
              Giriş Yap
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Menüyü aç/kapa"
            onClick={() => setMobileOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-lg text-zinc-300 hover:bg-zinc-800 transition-colors lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md lg:hidden animate-slide-down">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-1 sm:px-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-500/10 text-brand-300'
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-2 block rounded-md bg-brand-500 px-3 py-2 text-center text-sm font-medium text-white"
              >
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
