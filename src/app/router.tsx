import { Routes, Route } from 'react-router-dom';

import { MainLayout } from '@/shared/components/layout/MainLayout';
import { ProtectedRoute } from '@/app/ProtectedRoute';

// Public pages
import HomePage          from '@/features/home/pages/HomePage';
import AboutPage         from '@/features/home/pages/AboutPage';
import ContactPage       from '@/features/home/pages/ContactPage';
import ProductsPage      from '@/features/products/pages/ProductsPage';
import CartPage          from '@/features/cart/pages/CartPage';
import LoginPage         from '@/features/auth/pages/LoginPage';
import RegisterPage      from '@/features/auth/pages/RegisterPage';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';
import NotFoundPage      from '@/app/NotFoundPage';

// Protected pages
import OrdersPage   from '@/features/orders/pages/OrdersPage';
import CheckoutPage from '@/features/checkout/pages/CheckoutPage';

/**
 * AppRouter — uygulamanın tüm route tanımları.
 *
 * Yapı:
 *   MainLayout (navbar + footer + toasts)
 *     ├── Public route'lar (herkese açık)
 *     └── ProtectedRoute sarıcısı
 *           ├── /orders
 *           └── /checkout
 *
 *   Auth sayfaları da MainLayout altında çünkü navbar'ın görünmesini
 *   istiyoruz. İstersen bunları ayrı bir layout'a da alabilirsin.
 *
 * `*` path'i en son — önce tüm eşleşmeler denenir, hiçbiri tutmazsa 404.
 */

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route index                     element={<HomePage />} />
        <Route path="/products"          element={<ProductsPage />} />
        <Route path="/about"             element={<AboutPage />} />
        <Route path="/contact"           element={<ContactPage />} />
        <Route path="/cart"              element={<CartPage />} />
        <Route path="/login"             element={<LoginPage />} />
        <Route path="/register"          element={<RegisterPage />} />
        <Route path="/forgot-password"   element={<ForgotPasswordPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/orders"   element={<OrdersPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
