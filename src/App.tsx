import { AppRouter } from '@/app/router';

/**
 * App — uygulamanın en tepesi.
 *
 * BrowserRouter main.tsx'te — burada sadece route tree'sini render ediyoruz.
 * Context provider'lar ileride eklenirse (ThemeProvider, QueryClient, vs.)
 * bu component içinde sıralanır.
 */

export default function App() {
  return <AppRouter />;
}
