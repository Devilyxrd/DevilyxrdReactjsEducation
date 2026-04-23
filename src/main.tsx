import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

/**
 * main.tsx — Vite'ın entry'si.
 *
 * - StrictMode: dev'de hooks'ları 2 kez çağırır, side effect hatalarını
 *   erken yakalamanı sağlar (prod'da etkisiz).
 * - BrowserRouter: HTML5 history API ile route yönetimi.
 * - <html class="dark"> atamasını burada yapıyoruz — proje daima dark theme.
 */

document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
