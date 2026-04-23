import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ToastContainer } from '@/shared/components/ui/ToastContainer';

/**
 * MainLayout — router'da tüm sayfaların sarıldığı iskelet.
 *
 *   <Route element={<MainLayout />}>
 *     <Route index element={<HomePage />} />
 *     ...
 *   </Route>
 *
 * Outlet: child route buraya render edilir. min-h-screen + flex-col + footer'ın
 * mt-auto olması, içerik kısaysa bile footer'ın dibe oturmasını sağlar.
 *
 * Route değiştiğinde sayfa başına scroll atıyoruz (useEffect ile) — SPA'larda
 * yeni sayfaya geçildiğinde tarayıcı otomatik scroll yapmaz.
 */

export function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
