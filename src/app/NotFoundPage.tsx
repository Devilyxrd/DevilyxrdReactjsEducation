import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

/**
 * NotFoundPage — catch-all '*' route'u için 404 sayfası.
 * Ağır sunum, state yok.
 */

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1),transparent_60%)]" />
      <div className="relative animate-fade-in">
        <div className="text-9xl font-black leading-none text-transparent bg-gradient-to-b from-brand-400 via-brand-500 to-brand-800 bg-clip-text animate-slide-up">
          404
        </div>
        <h1
          className="mt-4 text-2xl font-bold text-zinc-100 animate-slide-up"
          style={{ animationDelay: '80ms' }}
        >
          Sayfa bulunamadı
        </h1>
        <p
          className="mt-2 text-sm text-zinc-400 animate-slide-up"
          style={{ animationDelay: '160ms' }}
        >
          Aradığın sayfa ya taşınmış ya da hiç var olmamış.
        </p>
        <div className="mt-8 animate-slide-up" style={{ animationDelay: '240ms' }}>
          <Link to="/">
            <Button leftIcon={<Home className="h-4 w-4" />}>Anasayfaya Dön</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
