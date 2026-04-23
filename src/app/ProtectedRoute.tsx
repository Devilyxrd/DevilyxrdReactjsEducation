import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSessionStore } from '@/features/auth/store/session.store';
import { Spinner } from '@/shared/components/ui/Spinner';

/**
 * ProtectedRoute — giriş yapmamış kullanıcıları /login'e yönlendiren sarıcı.
 *
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/orders"   element={<OrdersPage />} />
 *     <Route path="/checkout" element={<CheckoutPage />} />
 *   </Route>
 *
 * Kritik nokta: `hydrated` flag'i.
 *   persist middleware localStorage'tan state'i ASYNC yüklüyor. İlk render'da
 *   user hep null görünür. Bu yüzden `hydrated === false` iken Spinner
 *   gösteriyoruz; redirect yapmıyoruz. `session.store.ts` içinde
 *   onRehydrateStorage callback'i bu flag'i true'ya çekiyor.
 *
 * Redirect yaparken `state: { from: location }` geçiyoruz — login olduktan
 * sonra LoginPage bu pathname'e geri yönlendirir (UX iyileştirmesi).
 */

export function ProtectedRoute() {
  const user     = useSessionStore((s) => s.user);
  const hydrated = useSessionStore((s) => s.hydrated);
  const location = useLocation();

  if (!hydrated) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
