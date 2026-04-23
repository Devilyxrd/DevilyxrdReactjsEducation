import { Link } from 'react-router-dom';
import { Globe, AtSign, Send, ShoppingBag } from 'lucide-react';

/**
 * Footer — her sayfanın altında görünen bilgi bandı.
 * Dinamik state yok, tamamen sunum. Layout tarafından Outlet'in altında
 * render ediliyor.
 */

const columns = [
  {
    title: 'Alışveriş',
    links: [
      { to: '/products', label: 'Tüm Ürünler' },
      { to: '/cart',     label: 'Sepetim' },
      { to: '/orders',   label: 'Siparişlerim' },
    ],
  },
  {
    title: 'Kurumsal',
    links: [
      { to: '/about',   label: 'Hakkımızda' },
      { to: '/contact', label: 'İletişim' },
    ],
  },
  {
    title: 'Hesap',
    links: [
      { to: '/login',           label: 'Giriş Yap' },
      { to: '/register',        label: 'Kayıt Ol' },
      { to: '/forgot-password', label: 'Şifremi Unuttum' },
    ],
  },
];

const socials = [
  { href: '#', label: 'Website', icon: Globe },
  { href: '#', label: 'E-posta', icon: AtSign },
  { href: '#', label: 'Telegram', icon: Send },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20">
                <ShoppingBag className="h-4.5 w-4.5 text-white" />
              </span>
              <span className="text-base font-bold text-zinc-100">Devilyxrd</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-zinc-400">
              Modern, hızlı ve tamamen React + Zustand üzerine kurulu e-ticaret
              örneği.
            </p>
            <div className="mt-4 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-800 text-zinc-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500/50 hover:text-brand-300"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-zinc-100">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-zinc-400 transition-colors hover:text-brand-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Devilyxrd · Eğitim amaçlı demo ·
          React + Vite + Zustand
        </div>
      </div>
    </footer>
  );
}
