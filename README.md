# React + Vite + TypeScript + Zustand — Junior'dan Mid Level'a Geçiş Rehberi

> Bu doküman, React'te temel seviyeye sahip bir geliştiricinin **kendi başına mid level'a geçişini** yapılandıran bir **eğitim + referans handbook** birleşimidir.
>
> Amaç: JSX ve `useState` bilen birini **4–6 hafta içinde** component architecture, routing, API tüketimi, global state (Zustand), session yönetimi ve production-ready frontend pratiklerine taşımak.
>
> Bu rehber **okumak için değil, yazarak ilerlemek için** hazırlanmıştır. Her bölümün sonundaki **görev tamamlanmadan** bir sonrakine geçilmesi önerilmez.

---

## 🎯 Bu Rehber Kime İçin?

- `useState` yazabilen ama `useEffect`'in dependency'si neden karıştıyor bilmeyen
- Tek dosyada React yazan ama component'i ne zaman ayıracağını bilmeyen
- Props drilling'den şikayet eden ama Context/Zustand'a atlamayan
- API çağrısını `useEffect`'in içine yığan, loading/error state'i tutamayan
- "Auth state'i nerede tutayım" sorusuna cevabı `localStorage` dışında bilmeyen

---

## 🧭 Rehberin Mantığı

- **Tek stack:** React + Vite + TypeScript + Tailwind + React Router + Zustand
- **Backend yok:** Bu rehber **sadece frontend**. API ihtiyacı olduğu yerlerde [JSONPlaceholder](https://jsonplaceholder.typicode.com/) veya benzeri public API kullanılır. Gerçek backend kendi işin.
- **State:** UI state + domain state + session state → **hepsi Zustand**. Redux Toolkit'e **sonraki adım** olarak bakarız, şu an gerekli değil.
- **Session management:** Login/logout/refresh persist — Zustand + `persist` middleware ile. Backend yoksa bile akış öğrenilir.
- **Mid level hedefi:** Tek başına orta ölçekte bir SPA tasarlayıp teslim edebilmek.

---

## 🚀 Bu Repodaki Demo Proje

Bu repo, rehberde anlatılan tüm konseptlerin **çalışan bir e-ticaret SPA'ında**
uygulanmış halini barındırır. Backend yok; tüm veri mock / `localStorage`
üzerinden. Amaç: öğrenirken bakman, karıştırman, kırman için **tek kaynakta
her şey**.

### Hızlı Kurulum

```bash
yarn install
yarn dev          # http://localhost:5173
yarn build        # production build
```

### 🔐 Demo Hesap

| Alan | Değer |
|------|-------|
| **E-posta** | `demo@local` |
| **Şifre** | `demo1234` |
| **Güvenlik Sorusu** | İlk evcil hayvanımın adı? |
| **Cevap** | `pamuk` |

İstersen `/register` üzerinden kendi hesabını da oluşturabilirsin — kayıt +
session + forgot-password akışları tamamı çalışır durumda (mock auth servisi
üzerinden).

### Sayfa Haritası

| Path | Auth | Açıklama |
|------|------|----------|
| `/` | public | Anasayfa — hero + öne çıkan ürünler + özellik grid |
| `/products` | public | Ürün listesi + kategori filtresi + arama (debounce'lu) |
| `/about` | public | Hakkımızda — statik içerik |
| `/contact` | public | İletişim formu (elle validation) |
| `/cart` | public | Sepet — Zustand + `persist`, ücretsiz kargo eşiği |
| `/login` | public | Giriş — mock auth, demo hesap hint'i |
| `/register` | public | Kayıt ol — güvenlik sorusu ile |
| `/forgot-password` | public | 2-adımlı şifre sıfırlama (state machine pattern) |
| `/checkout` | **protected** | Ödeme — teslimat formu + sipariş oluştur |
| `/orders` | **protected** | Siparişlerim — status badge, teslimat bilgisi |
| `*` | — | 404 sayfası |

### Feature-Based Klasör Yapısı

```
src/
├── main.tsx                          ← Entry: StrictMode + BrowserRouter + dark class
├── App.tsx                           ← AppRouter'ı render eder (future-proof provider slotu)
├── index.css                         ← Tailwind v4 entry + @theme + keyframes
│
├── app/                              ← Uygulama-seviye config
│   ├── router.tsx                    ← Tüm route tanımları (MainLayout + ProtectedRoute)
│   ├── ProtectedRoute.tsx            ← Auth guard (hydrated flag kontrolü dahil)
│   └── NotFoundPage.tsx              ← 404
│
├── features/                         ← Her feature kendi başına bir modül
│   ├── auth/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx         ← useState form + authService.login
│   │   │   ├── RegisterPage.tsx      ← güvenlik sorusu + otomatik login
│   │   │   └── ForgotPasswordPage.tsx← 2 step state machine
│   │   ├── components/AuthCard.tsx   ← 3 auth sayfasının ortak kutusu
│   │   ├── services/auth.service.ts  ← Mock auth API (setTimeout ile latency)
│   │   └── store/session.store.ts    ← Zustand + persist + hydrated flag
│   │
│   ├── products/
│   │   ├── pages/ProductsPage.tsx    ← useEffect fetch + useDebounce + useMemo filter
│   │   ├── components/ProductCard.tsx, ProductGrid.tsx
│   │   ├── data/products.mock.ts     ← 17 ürün + fake fetchProducts() Promise
│   │   └── types.ts
│   │
│   ├── cart/
│   │   ├── pages/CartPage.tsx        ← Derived state (total, itemCount), free shipping bar
│   │   ├── components/CartItemRow.tsx
│   │   ├── store/cart.store.ts       ← Zustand + persist
│   │   └── types.ts
│   │
│   ├── orders/
│   │   ├── pages/OrdersPage.tsx      ← useMemo ile kullanıcı-filtreli sipariş
│   │   ├── components/OrderCard.tsx
│   │   └── store/orders.store.ts     ← Zustand + persist, createOrder mutasyonu
│   │
│   ├── checkout/
│   │   └── pages/CheckoutPage.tsx    ← Form + snapshot cart → createOrder → cart.clear
│   │
│   └── home/
│       ├── pages/HomePage.tsx, AboutPage.tsx, ContactPage.tsx
│       └── components/HeroSection.tsx, FeaturedProducts.tsx, FeatureGrid.tsx
│
└── shared/                           ← Feature'lar arası paylaşılan kod
    ├── components/
    │   ├── ui/                       ← Button, Input, Card, Badge, Spinner,
    │   │                               EmptyState, ToastContainer
    │   └── layout/                   ← Navbar, Footer, MainLayout
    ├── hooks/useDebounce.ts
    ├── store/ui.store.ts             ← Toast sistemi
    ├── utils/cn.ts, formatTL.ts
    └── types/
```

**Feature-based yapının iki altın kuralı:**

1. **Bir feature, dışarıya sadece `pages/` (ve varsa `components/` içindeki
   yeniden kullanılabilirler) üzerinden bilinir.** `store/`, `services/`,
   `data/` gibi iç detaylar mümkün olduğunca feature'da kalır.
2. **`shared/` içinde domain bilgisi olmaz.** `Button`, `Input` gibi şeyler
   evrenseldir; `ProductCard` ise `features/products/` içinde durur.

### Store Haritası

Tüm global state **Zustand**'dir. Hepsi selector pattern ile tüketilir:
`useStore(s => s.x)`.

| Store | Dosya | Persist? | Amaç |
|-------|-------|----------|------|
| `useUIStore` | `shared/store/ui.store.ts` | Hayır | Toast kuyruğu |
| `useSessionStore` | `features/auth/store/session.store.ts` | Evet | user / token / registeredUsers mock DB / `hydrated` flag |
| `useCartStore` | `features/cart/store/cart.store.ts` | Evet | Sepet kalemleri + derived total/itemCount |
| `useOrdersStore` | `features/orders/store/orders.store.ts` | Evet | Siparişler + `createOrder` |

### Rehberden Sisteme Eşleme — Neyi Nerede Görebilirsin?

Rehberin kavramları gerçek kodda şu dosyalarda somutlaşıyor:

| Rehber Konusu | Projede Uygulandığı Dosyalar |
|---------------|-------------------------------|
| **`useState` (form)** | `LoginPage`, `RegisterPage`, `ContactPage`, `CheckoutPage` |
| **`useEffect` + cleanup** | `Navbar` (scroll listener), `ProductsPage` (fetch + cancel), `FeaturedProducts` |
| **`useMemo`** | `ProductsPage` (filtered list), `OrdersPage` (myOrders) |
| **`useDebounce` (custom hook)** | `shared/hooks/useDebounce.ts` → `ProductsPage` search |
| **Service layer** | `features/auth/services/auth.service.ts` |
| **Zustand `create`** | Tüm store dosyaları |
| **Zustand `persist`** | `session`, `cart`, `orders` store'ları |
| **`persist` hydrate flag** | `session.store.ts` → `onRehydrateStorage` |
| **Store `getState()` (component dışı)** | `auth.service.ts` içinde `useSessionStore.getState()` |
| **React Router protected route** | `app/ProtectedRoute.tsx` + login'de `location.state.from` |
| **Nested layout + `<Outlet />`** | `MainLayout.tsx` |
| **Loading / error / empty / data** | `ProductsPage` (4 durum da var) |
| **Dark theme** | `main.tsx` → `html.dark`, `index.css` → `@theme` + `bg-zinc-950` |
| **Animasyonlar** | `index.css` keyframes + Tailwind `animate-*` class'ları |

### Kod İçi Yorumlar

Her dosyanın başında **neyi ve neden yaptığını** anlatan bir yorum bloğu
bulunur. Amaç: dosyayı ilk açtığında 10 saniyede "burada ne var ve niye"
sorusuna cevap alman. Detaylar ve edge case'ler inline yorumlarla destekli.

### Neden Bu Mimari Seçildi?

- **Feature-based:** Monolitik `components/pages/hooks/` yapısı 30+ dosyadan
  sonra darmadağın olur. Feature-based'te yeni bir özellik geldiğinde yeni
  bir klasör açarsın, geri kalan kod dokunulmaz.
- **Zustand + persist:** Redux Toolkit'in boilerplate'i öğrenme için engel;
  Zustand iki satırda store kurdurur, `persist` middleware'i de localStorage
  senkronunu bedavaya getirir.
- **Mock service layer:** Backend gelene kadar akışı test etmek için. Backend
  bağlandığında **sadece `services/*.service.ts`** değişir; component'ler
  aynı kalır.
- **Dark theme by default:** Modern e-ticaret sitelerinin çoğu karanlık tema
  sunuyor; kontrast + glow efektleri markayı öne çıkarıyor.

---

## İçindekiler

1. [Hedef Çıktılar](#-hedef-çıktılar)
2. [Önkoşullar ve Kurulum](#-önkoşullar-ve-kurulum)
3. [4–6 Haftalık Roadmap](#-46-haftalık-roadmap)
4. [React Temelleri](#-1-react-temelleri)
5. [Hooks](#-2-hooks)
6. [Vite + TypeScript](#-3-vite--typescript)
7. [Yarn (Package Manager)](#-4-yarn-package-manager)
8. [Tailwind CSS](#-5-tailwind-css)
9. [React Router (SPA Routing)](#-6-react-router-spa-routing)
10. [API Entegrasyonu](#-7-api-entegrasyonu)
11. [Zustand (Global State)](#-8-zustand-global-state)
12. [Session Management (Zustand ile)](#-9-session-management-zustand-ile)
13. [Production Yapı](#-10-production-yapı)
14. [Performance & Best Practices](#-11-performance--best-practices)
15. [Frontend Security](#️-12-frontend-security)
16. [Final Project](#-13-final-project)
17. [Sonraki Adım: Redux Toolkit](#-sonraki-adım-redux-toolkit)
18. [Gelişim Modeli](#-gelişim-modeli)
19. [Ek Kaynaklar](#-ek-kaynaklar)

---

## 🎯 Hedef Çıktılar

Bu doküman sonunda şunları yapabilir olacaksın:

- [x] React ile **component tabanlı UI** yazabilirsin
- [x] JSX, props, state, hooks akışlarını **doğal** kullanırsın
- [x] Vite ile **TypeScript projesi** kurarsın, ESLint/Prettier ayarlarsın
- [x] `fetch` ile API **tüketirsin**, loading/error/empty state yönetirsin
- [x] **Zustand ile global state** yönetirsin — UI, domain, session
- [x] Session persist edip, sayfa yenilense bile login'i korursun
- [x] React Router ile **SPA routing**, protected route kurarsın
- [x] **Performans** için `useMemo`, `useCallback`, `React.memo`, lazy loading kullanırsın
- [x] **XSS, env var sızıntısı, token storage** gibi frontend güvenlik tuzaklarını bilirsin
- [x] **Component + hook + service + store** katmanlarını doğru ayırırsın

---

## 🧰 Önkoşullar ve Kurulum

### Gerekli Ortam

| Araç | Amaç | Link |
|------|------|------|
| **Node.js** (LTS, ≥20) | JavaScript runtime | [nodejs.org](https://nodejs.org/) |
| **Yarn** (classic veya berry) | Package manager | [yarnpkg.com](https://yarnpkg.com/) |
| **VS Code** | Kod editörü | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Git** | Sürüm kontrolü | [git-scm.com](https://git-scm.com/) |
| **Chrome / Edge** | Geliştirme + DevTools | — |

### Önerilen VS Code Eklentileri

- **ES7+ React/Redux/React-Native snippets** (`rafce` gibi snippet'ler)
- **ESLint** — linter
- **Prettier — Code formatter**
- **Tailwind CSS IntelliSense** — class otomatik tamamlama
- **Error Lens** — hataları satır kenarında göster
- **GitLens** — git geçmişi
- **Auto Rename Tag** — JSX tag'i düzenlerken eşi de değişir

### Chrome Eklentileri

- **React Developer Tools** — component ağacı + state inspect
- **Redux DevTools** — Zustand'ın `devtools` middleware'i de buraya bağlanır

### Minimum Bilgi Seviyesi

Başlamadan önce aşağıdaki temelleri biliyor olmalısın — bilmiyorsan [Ek Kaynaklar](#-ek-kaynaklar) bölümündeki linkleri takip et:

- HTML / CSS temel seviye
- JavaScript **ES6+** (`const`, `let`, arrow function, `destructuring`, `spread`, `async/await`, `Promise`, `map/filter/reduce`)
- HTTP temel (method, status code, request/response)
- Terminal / komut satırı kullanımı
- Git temel (`clone`, `commit`, `push`, `pull`, `branch`)

> **Kritik:** Modern JS bilmeden React öğrenilmez. `async/await` okuyamıyorsan önce [javascript.info](https://javascript.info/) ile 1–2 hafta JS çalış.

---

## 🧭 4–6 Haftalık Roadmap

### Hafta 1 — JS Refresh + React Temelleri
- ES6+ refresh (destructuring, spread, arrow, modules)
- JSX, functional components, props
- `useState`, event handler'lar
- Conditional rendering, liste render (`.map`)

### Hafta 2 — Hooks + Vite + TypeScript
- `useEffect`, `useRef`, `useMemo`, `useCallback`
- Custom hook yazımı
- Vite ile proje kurulumu, TS config, ESLint
- Tailwind v4 setup

### Hafta 3 — Routing + API
- React Router kurulumu, `Link`, `useNavigate`, nested route
- `fetch` wrapper, service layer
- Loading / error / empty state yönetimi
- Protected route

### Hafta 4 — Zustand + Session
- Zustand ile UI store (toast, modal)
- Zustand ile domain store (cart, todo, favorites)
- Session store — login/logout/me akışı
- `persist` middleware ile sayfa yenilemesinden sağ kalma

### Hafta 5–6 — Production + Final Project
- Klasör yapısı (`components/pages/hooks/services/store/types`)
- Form handling + validation
- Performance (`memo`, lazy, code split)
- Error boundary, global hata yönetimi
- **Final project** — kişisel bir SPA teslim et

> **Günlük hedef:** 1 konu + 1 görev.
> **Haftalık hedef:** 1 mini proje + yazdığını **ertesi gün yeniden oku + refactor et.**

---

## ⚛️ 1. React Temelleri

### Neden React?

- **Component tabanlı** — UI'ı küçük, tekrar kullanılabilir parçalara bölersin
- **Declarative** — "state şu olsun" dersin, UI'ı React günceller
- **Ecosystem** — routing, state, form, test için hazır kütüphaneler
- **İş piyasası** — TR pazarında en çok aranan frontend stack'i

### JSX — JavaScript İçinde HTML

JSX, `React.createElement()` çağrılarının şeker sözdizimi. Derleyici (Vite / Babel / SWC) bunu JS'e çevirir.

```tsx
function Hello() {
  return <h1>Merhaba</h1>;
}

// class -> className, for -> htmlFor
function Login() {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" className="border rounded p-2" />
    </form>
  );
}

// JS ifadesi gömmek için { }
function Greeting({ name }: { name: string }) {
  const upper = name.toUpperCase();
  return <h1>Merhaba, {upper}</h1>;
}
```

**JSX kuralları:**
- Tek root element döndür (veya `<>...</>` fragment)
- `class` yerine `className`, `for` yerine `htmlFor`
- `{}` içinde **JS ifadesi** yazılır, `if/for` statement **yazılmaz** (ternary veya `.map` kullan)
- Self-closing tag'ler: `<img />`, `<input />`

### Component — React'ın Yapı Taşı

Bir component, **JSX döndüren bir fonksiyon**dur. Büyük harfle başlar (küçük harf = HTML tag).

```tsx
// components/ui/Button.tsx
type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
};

export function Button({ children, onClick, variant = 'primary' }: Props) {
  const styles = variant === 'primary'
    ? 'bg-blue-600 text-white'
    : 'bg-zinc-200 text-zinc-900';

  return (
    <button className={`px-4 py-2 rounded ${styles}`} onClick={onClick}>
      {children}
    </button>
  );
}

// Kullanım
<Button variant="primary" onClick={() => alert('hi')}>
  Kaydet
</Button>
```

### Props — Aşağı Doğru Veri Akışı

Parent → child yönünde **salt-okunur** veri geçirme yolu.

```tsx
type UserCardProps = {
  name: string;
  email: string;
};

function UserCard({ name, email }: UserCardProps) {
  return (
    <div className="p-4 border rounded">
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}

<UserCard name="Ali" email="ali@x.com" />
```

> **Altın Kural:** Props'u child içinde **asla** mutate etme. Props immutable'dır.

### `useState` — Component State

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Sayı: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(c => c - 1)}>-</button>
    </div>
  );
}
```

**Önemli:**
- `setCount(count + 1)` yerine `setCount(c => c + 1)` tercih et (closure tuzağına düşmez)
- State **asla doğrudan** mutate edilmez: `setUser(u => ({ ...u, name: 'Ali' }))`
- State güncellemesi **async**'tir — `setCount` sonrası `count` hemen değişmez, bir sonraki render'da değişir

### Conditional Rendering + Liste

```tsx
function TodoList({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return <p>Henüz todo yok</p>;
  }

  return (
    <ul>
      {todos.map(t => (
        <li key={t.id}>                    {/* key ZORUNLU */}
          {t.title} — {t.done ? '✓' : '…'}
        </li>
      ))}
    </ul>
  );
}
```

> **Kritik:** `.map` içinde **mutlaka** `key` prop'u ver. İndex kullanmak yerine stabil id kullan.

### 🎥 Videolar

- [React Crash Course — Traversy Media](https://www.youtube.com/watch?v=w7ejDZ8SWv8)
- [Learn React JS — JSX, Components, Props](https://www.youtube.com/watch?v=bMknfKXIFA8)
- [React JS Full Course — Dave Gray](https://www.youtube.com/watch?v=RVFAyFWO4go)

### 📚 Ek Okuma

- [React Docs — Quick Start](https://react.dev/learn)
- [React Docs — Describing the UI](https://react.dev/learn/describing-the-ui)
- [React Docs — Adding Interactivity](https://react.dev/learn/adding-interactivity)

### 🧪 Görev

1. **Counter** component yaz: `+`, `-`, `reset` butonları.
2. **TodoList** yaz: input'a yaz → enter → liste, her item'da sil butonu.
3. **UserCard** component yaz: `name`, `email`, `avatar` props.
4. 5 kullanıcıdan oluşan mock array'i `.map` ile render et.
5. Tıklama ile bir item'ı "favorite" işaretle (state lift etme pratiği).

---

## 🪝 2. Hooks

Hook'lar, functional component'a state / lifecycle / context gibi özellikleri katan fonksiyonlardır. `use` ile başlar.

**Kurallar (ihlal edersen hata):**
1. Hook **sadece component veya başka hook** içinde çağrılır
2. Hook **top-level**'de çağrılır — if/for/callback **içinde değil**
3. İsmi **`use`** ile başlar

### `useEffect` — Side Effect + Lifecycle

```tsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const res  = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      const data = await res.json();
      if (!cancelled) {
        setUser(data);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };    // cleanup — unmount veya userId değişince
  }, [userId]);                             // dependency — userId değişince yeniden çalışır

  if (loading) return <p>Yükleniyor...</p>;
  if (!user)   return <p>Bulunamadı</p>;
  return <div>{user.name}</div>;
}
```

**Dependency array kuralları:**
- `[]` → **sadece bir kere** çalışır (mount)
- `[a, b]` → `a` veya `b` değişince **yeniden** çalışır
- **yazmazsan** → **her render'da** çalışır (tehlikeli, infinite loop riski)

> **Kritik:** `useEffect` dependency'si eksikse ESLint (`react-hooks/exhaustive-deps`) seni uyaracak. **Uyarıya güven, "deaktive" etme.** Gerçekten hariç tutman gerekiyorsa ref pattern'i düşün.

### `useRef` — DOM Erişimi + Mutable Değer

```tsx
import { useRef, useEffect } from 'react';

function FocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();             // mount'ta focus
  }, []);

  return <input ref={inputRef} />;
}

// Render tetiklemeden mutable değer tut
function Timer() {
  const timerRef = useRef<number | null>(null);

  const start = () => {
    timerRef.current = window.setInterval(() => console.log('tick'), 1000);
  };
  const stop  = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
  return <div>...</div>;
}
```

### `useMemo` — Hesaplama Cache'i

Pahalı bir hesaplamayı dependency değişmedikçe yeniden yapma:

```tsx
import { useMemo, useState } from 'react';

function TodoList({ todos }: { todos: Todo[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => todos.filter(t => t.title.toLowerCase().includes(query.toLowerCase())),
    [todos, query],
  );

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul>{filtered.map(t => <li key={t.id}>{t.title}</li>)}</ul>
    </>
  );
}
```

> **Yanlış kullanım:** Her yere `useMemo` sarmak performans **düşürür** (bağımlılık karşılaştırması + cache maliyeti). Sadece gerçekten pahalı hesaplamalar için.

### `useCallback` — Fonksiyon Referansı Sabitle

```tsx
import { useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  // Her render'da yeni fonksiyon yaratmasın
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return <Child onClick={handleClick} />;   // Child.memo olunca gereksiz render olmaz
}
```

> **Altın Kural:** `useCallback` **sadece** `React.memo`'lu child'a veya başka bir hook'un dependency'sine geçirilen fonksiyonlar için gereklidir. Aksi halde hiçbir şey kazandırmaz.

### Custom Hook — Logic Paylaşımı

Aynı state/effect mantığını birden fazla component'ta kullanıyorsan, custom hook'a çıkar:

```tsx
// hooks/useFetch.ts
import { useState, useEffect } from 'react';

export function useFetch<T>(url: string) {
  const [data,    setData]    = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false); } });

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Kullanım
function Posts() {
  const { data, loading, error } = useFetch<Post[]>('https://jsonplaceholder.typicode.com/posts');
  if (loading) return <p>Yükleniyor...</p>;
  if (error)   return <p>{error.message}</p>;
  return <ul>{data!.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

### `useContext` — Prop Drilling'e Son

Birçok component'in aynı veriye (tema, locale) ihtiyacı varsa prop drilling yerine Context kullan:

```tsx
import { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

// Derin component'ta
function Navbar() {
  const { theme, toggle } = useTheme();
  return <button onClick={toggle}>{theme}</button>;
}
```

> **Dikkat:** Context değeri her değiştiğinde **tüm consumer component'lar** render olur. Sık değişen state (örn. input value) için Context **yanlış araçtır** — Zustand kullan.

### 🎥 Videolar

- [10 React Hooks Explained — PedroTech](https://www.youtube.com/watch?v=TNhaISOUy6Q)
- [useEffect Full Guide — Jack Herrington](https://www.youtube.com/watch?v=dH6i3GurZW8)
- [Custom Hooks — Web Dev Simplified](https://www.youtube.com/watch?v=6ThXsUwLWvc)

### 📚 Ek Okuma

- [React Docs — useState](https://react.dev/reference/react/useState)
- [React Docs — useEffect](https://react.dev/reference/react/useEffect)
- [React Docs — Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

### 🧪 Görev

1. `useCounter(initial, step)` custom hook yaz — `{ count, inc, dec, reset }` döndürsün.
2. `useDebounce(value, delay)` custom hook yaz — search input için kullan.
3. `useLocalStorage(key, initial)` yaz — state + `localStorage` sync.
4. `useFetch` ile `jsonplaceholder/posts` çek, loading/error/empty göster.
5. **Bonus:** `useClickOutside(ref, handler)` yaz — dropdown kapatmak için.

---

## ⚡ 3. Vite + TypeScript

### Neden Vite?

- **Native ESM** — dev'de bundle yok, dosya başına load
- **esbuild** prebundling — ilk dev start çok hızlı
- **HMR** — dosya kaydettiğinde component anında güncellenir
- **Config minimum** — `vite.config.ts` tek dosya
- **Framework-agnostic** — React, Vue, Svelte, vanilla hepsi aynı mantık

### Proje Kurulumu

```bash
yarn create vite my-app --template react-ts
cd my-app
yarn install
yarn dev                               # http://localhost:5173
```

### Çıktı Yapısı

```
my-app/
├── public/                       ← statik asset (favicon, robots.txt)
├── src/
│   ├── main.tsx                  ← Entry — ReactDOM.createRoot
│   ├── App.tsx                   ← Root component
│   ├── App.css
│   ├── index.css
│   └── assets/
├── index.html                    ← Vite'ın entry HTML'i
├── vite.config.ts
├── tsconfig.json
├── package.json
└── yarn.lock
```

### `vite.config.ts` — Temel Config

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@':           path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks':      path.resolve(__dirname, 'src/hooks'),
      '@store':      path.resolve(__dirname, 'src/store'),
    },
  },

  server: {
    port: 5173,
  },
});
```

> **`@/` alias kullanımı:** `import Button from '../../../components/ui/Button'` yerine `import Button from '@/components/ui/Button'`. TS'de `tsconfig.json`'daki `paths` alanıyla eşleşmeli.

### TypeScript — Kısa Giriş

TS = JS + tip sistemi. Derleme aşamasında tip hatalarını yakalar, runtime'da saf JS'e derlenir.

```ts
// Primitives
let name:    string  = 'Ali';
let age:     number  = 25;
let active:  boolean = true;
let maybe:   string | null = null;         // union

// Array
let nums:    number[] = [1, 2, 3];
let users:   User[]   = [];

// Object / Interface
interface User {
  id:    number;
  name:  string;
  email: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';   // literal union

// Function
function greet(name: string): string {
  return `Merhaba ${name}`;
}

const add = (a: number, b: number): number => a + b;

// Generic
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const n = first<number>([1, 2, 3]);        // number | undefined
```

### React + TS — Component Tipleme

```tsx
// Props
type ButtonProps = {
  children:  React.ReactNode;
  onClick?:  (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?:  'primary' | 'secondary';
  disabled?: boolean;
};

export function Button({ children, onClick, variant = 'primary', disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={variant}>
      {children}
    </button>
  );
}

// useState
const [user, setUser] = useState<User | null>(null);

// useRef
const inputRef = useRef<HTMLInputElement>(null);

// Event handlers
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
}

function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value);
}
```

### ESLint + Prettier

Vite template zaten ESLint ile gelir. Prettier ekle:

```bash
yarn add -D prettier
```

`.prettierrc.json`:
```json
{ "singleQuote": true, "semi": true, "printWidth": 100, "trailingComma": "all" }
```

VS Code'da **"Format on save"** + ESLint eklentisi aktif olsun.

### Build

```bash
yarn build                         # dist/ klasörü oluşur (tsc + vite build)
yarn preview                       # dist/ üzerinden local sunucu
```

> Production deploy'da `dist/` klasörünü herhangi bir static host'a at (Netlify, Vercel, Cloudflare Pages, nginx). **Server-side rendering gerekmez** — bu bir SPA.

### 🎥 Videolar

- [Vite in 100 Seconds — Fireship](https://www.youtube.com/watch?v=KCrXgy8qtjM)
- [Vite Crash Course — Traversy Media](https://www.youtube.com/watch?v=89NJdbYTgJ8)
- [TypeScript in 100 Seconds — Fireship](https://www.youtube.com/watch?v=zQnBQ4tB3ZA)
- [Learn TypeScript — No BS TS](https://www.youtube.com/playlist?list=PLNqp92_EXZBJYFrpEzdO2EapvU0GOJ09n)

### 📚 Ek Okuma

- [Vite Guide](https://vitejs.dev/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### 🧪 Görev

1. `yarn create vite my-app --template react-ts` ile proje kur.
2. `@/` alias'ını `vite.config.ts` + `tsconfig.json`'a ekle.
3. `src/components/ui/Button.tsx` ve `Input.tsx` yaz, **tam** tipli.
4. Alias kullanarak `App.tsx`'te import et.
5. `yarn build` + `yarn preview` — dist'in çalıştığını doğrula.

---

## 📦 4. Yarn (Package Manager)

### Neden Yarn?

- **Lockfile deterministic** — `yarn.lock` tüm makinelerde tutarlı dependency
- **Workspaces** — monorepo desteği
- **Script alias** — `yarn dev` yerine `npm run dev`'e göre kısa

### Temel Komutlar

```bash
yarn init -y                       # package.json yarat
yarn install                       # dependency'leri yükle
yarn add axios                     # runtime dependency ekle
yarn add -D prettier               # dev dependency ekle
yarn remove axios                  # kaldır
yarn upgrade-interactive --latest  # seçmeli upgrade (tavsiye)
yarn dev                           # scripts.dev'i çalıştır
yarn why react                     # react'ı niye yükledik? (dep tree)
yarn dlx create-vite my-app        # tek seferlik CLI (npx benzeri)
```

### `package.json` — Kritik Alanlar

```json
{
  "name":    "my-app",
  "private": true,
  "type":    "module",
  "scripts": {
    "dev":     "vite",
    "build":   "tsc -b && vite build",
    "lint":    "eslint .",
    "preview": "vite preview"
  },
  "dependencies":    { "react": "^19.0.0" },
  "devDependencies": { "vite": "^6.0.0" }
}
```

### Semver Prefix'leri

| Prefix | Anlam | Örnek |
|--------|-------|-------|
| `^1.2.3` | `>=1.2.3 <2.0.0` — minor/patch güncel | Default yarn davranışı |
| `~1.2.3` | `>=1.2.3 <1.3.0` — sadece patch | Stabiler ama eski kalır |
| `1.2.3`  | Tam sürüm kilitli | Debug için geçici |

> **Pratik:** `yarn.lock`'u **mutlaka** commit et. `node_modules`'ı `.gitignore`'a ekle. Sürüm kitleme zaten `yarn.lock` ile oluyor — `package.json`'da `~` / tam sürüme geçmeye **gerek yok**.

### 🎥 Videolar

- [Yarn Package Manager Full Tutorial](https://www.youtube.com/watch?v=g9_6KmiBISk)
- [npm vs yarn vs pnpm — Fireship](https://www.youtube.com/watch?v=AzPgdg1z2aQ)

### 📚 Ek Okuma

- [Yarn Classic Docs](https://classic.yarnpkg.com/en/docs/)
- [Yarn Berry (v4)](https://yarnpkg.com/)
- [semver.org](https://semver.org/)

### 🧪 Görev

1. `yarn.lock`'u açıp içine bak — `integrity` ve `resolved` alanlarını anla.
2. `yarn why react` çalıştır — bağımlılık ağacını oku.
3. `yarn upgrade-interactive --latest` ile **dikkatli** upgrade yap, `yarn dev` hâlâ çalıştığını doğrula.
4. `package.json`'a özel bir script ekle: `"clean": "rm -rf dist node_modules"` ve dene.

---

## 🎨 5. Tailwind CSS

### Neden Tailwind?

- **Utility-first** — `class="p-4 rounded bg-blue-600"` — ayrı CSS dosyası yazmazsın
- **Design system** — spacing / color / shadow token'ları tutarlı
- **JIT** — sadece kullandığın class'lar bundle'a girer
- **Responsive** — `md:flex lg:grid` breakpoint prefix'leri

### Kurulum (Vite + Tailwind v4)

Tailwind v4 Vite plugin'i ile geliyor — `postcss.config.js` gerekmez.

```bash
yarn add -D tailwindcss @tailwindcss/vite
```

`vite.config.ts`:
```ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

`src/index.css`:
```css
@import "tailwindcss";
```

### Yaygın Utility'ler

```tsx
// Spacing / size
<div className="p-4 m-2 w-full max-w-lg">

// Flex / grid
<div className="flex items-center justify-between gap-4">
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

// Typography
<h1 className="text-2xl font-bold tracking-tight">
<p  className="text-sm text-zinc-500 leading-relaxed">

// Color / bg
<button className="bg-blue-600 hover:bg-blue-700 text-white">

// Border / radius / shadow
<div className="border border-zinc-200 rounded-lg shadow-sm">

// Responsive — breakpoint prefix
<div className="hidden md:flex">

// State variants
<button className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 focus:ring-2 focus:ring-blue-500">

// Dark mode
<div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
```

### `cn()` Helper — Conditional Class

Dinamik class'lar için `clsx` + `tailwind-merge`:

```bash
yarn add clsx tailwind-merge
```

```ts
// utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Kullanım
<button className={cn(
  'px-4 py-2 rounded',
  variant === 'primary'   && 'bg-blue-600 text-white',
  variant === 'secondary' && 'bg-zinc-200',
  disabled                && 'opacity-50 cursor-not-allowed',
)} />
```

> **Kural:** Aynı class grubunu **3+ yerde** tekrarlıyorsan bir component (örn. `<Button variant>`) veya `cn()` helper'ına çıkar. "Utility-first" = "kopyala-yapıştır" demek değildir.

### 🎥 Videolar

- [Tailwind CSS Full Course 2024](https://www.youtube.com/watch?v=ft30zcMlFao)
- [Tailwind Tips — Theo](https://www.youtube.com/watch?v=pfaSUYaSgRo)

### 📚 Ek Okuma

- [Tailwind Docs](https://tailwindcss.com/docs/installation)
- [Tailwind Cheatsheet (nerdcave)](https://nerdcave.com/tailwind-cheat-sheet)

### 🧪 Görev

1. `Button` component'ını Tailwind ile stille: 3 variant (primary/secondary/ghost), 3 size (sm/md/lg).
2. `cn()` helper'ını kur ve kullan.
3. Responsive navbar: mobile'da hamburger menu + desktop'ta inline linkler.
4. Dark mode toggle: `dark:` variant + state ile `<html class="dark">` toggle.

---

## 🧭 6. React Router (SPA Routing)

### Kurulum

```bash
yarn add react-router-dom
```

### Temel Setup

```tsx
// main.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
```

```tsx
// App.tsx
import { Routes, Route } from 'react-router-dom';
import HomePage     from './pages/HomePage';
import PostsPage    from './pages/PostsPage';
import PostPage     from './pages/PostPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/"              element={<HomePage />} />
      <Route path="/posts"         element={<PostsPage />} />
      <Route path="/posts/:id"     element={<PostPage />} />
      <Route path="*"              element={<NotFoundPage />} />
    </Routes>
  );
}
```

### Navigasyon

```tsx
import { Link, NavLink, useNavigate } from 'react-router-dom';

// Link — full reload olmadan route değişir
<Link to="/posts" className="underline">Postlar</Link>

// NavLink — aktif route'a class eklenir
<NavLink
  to="/posts"
  className={({ isActive }) => isActive ? 'font-bold' : ''}
>
  Postlar
</NavLink>

// Programmatic — form submit sonrası redirect
function LoginForm() {
  const navigate = useNavigate();

  async function handleSubmit() {
    // ...login logic
    navigate('/dashboard', { replace: true });
  }
}
```

### URL Param + Query

```tsx
import { useParams, useSearchParams } from 'react-router-dom';

// /posts/5 → { id: '5' }
function PostPage() {
  const { id } = useParams();
  const postId = Number(id);
  // ...
}

// /posts?search=foo&page=2
function PostsPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') ?? '';
  const page   = Number(params.get('page') ?? 1);

  function onSearchChange(v: string) {
    setParams(p => { p.set('search', v); return p; });
  }
}
```

### Nested Routes + Layout

```tsx
import { Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-6">
        <Outlet />      {/* child route buraya gelir */}
      </main>
      <Footer />
    </div>
  );
}

<Routes>
  <Route element={<AppLayout />}>
    <Route index           element={<HomePage />} />
    <Route path="posts"    element={<PostsPage />} />
    <Route path="profile"  element={<ProfilePage />} />
  </Route>
</Routes>
```

### Protected Route

Login gerektiren sayfaları koru. (Session state Zustand'da — sonraki bölümde göreceğiz.)

```tsx
// routes/ProtectedRoute.tsx
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSessionStore } from '@/store/session.store';

export function ProtectedRoute() {
  const user     = useSessionStore(s => s.user);
  const hydrated = useSessionStore(s => s.hydrated);
  const location = useLocation();

  if (!hydrated) return <p>Yükleniyor...</p>;              // persist middleware'i bekle
  if (!user)     return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
}

// Kullanım
<Routes>
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/profile"   element={<ProfilePage />} />
  </Route>
</Routes>
```

### Lazy Loading (Code Split)

Her sayfa için ayrı bundle — initial load hafifler:

```tsx
import { lazy, Suspense } from 'react';

const ProfilePage = lazy(() => import('./pages/ProfilePage'));

<Route
  path="/profile"
  element={
    <Suspense fallback={<Spinner />}>
      <ProfilePage />
    </Suspense>
  }
/>
```

### 🎥 Videolar

- [React Router v6 Full Course](https://www.youtube.com/watch?v=oTIJunBa6MA)
- [React Router Crash Course — Net Ninja](https://www.youtube.com/watch?v=OMQ2QARHPeM)

### 📚 Ek Okuma

- [React Router Docs](https://reactrouter.com/)
- [React Router — Protected Routes Pattern](https://ui.dev/react-router-protected-routes-authentication)

### 🧪 Görev

1. `HomePage`, `PostsPage`, `PostDetailPage`, `ProfilePage`, `LoginPage`, `NotFoundPage` oluştur.
2. `/posts/:id` dinamik route → `useParams` ile id al, JSONPlaceholder'dan çek.
3. `?search=foo` query filter → `useSearchParams`.
4. `AppLayout` wrapper yaz, `<Outlet />` ile nested route'ları render et.
5. `ProfilePage`'i `lazy` + `Suspense` ile yükle, Network tab'de ayrı bundle'ı doğrula.

---

## 🌐 7. API Entegrasyonu

### `fetch` — Browser Built-in

```ts
async function loadPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}
```

**Neden fetch?**
- Dependency yok — browser'ın built-in'i
- Promise tabanlı, `async/await` ile natürel
- `FormData`, `Blob`, `ReadableStream` hepsi native

### API Wrapper — Tavsiye

Tüm istekleri tek yerden yönet; base URL, header, error handling merkezleşsin:

```ts
// services/api.ts
const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://jsonplaceholder.typicode.com';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      message = data.message ?? message;
    } catch { /* response JSON değilse sorun değil */ }

    const err: Error & { status?: number } = new Error(message);
    err.status = res.status;
    throw err;
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get:    <T>(path: string)                  => request<T>(path),
  post:   <T>(path: string, body?: unknown)  => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    <T>(path: string, body?: unknown)  => request<T>(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: <T>(path: string)                  => request<T>(path, { method: 'DELETE' }),
};
```

### Service Layer

API çağrılarını component'ta değil, `services/` altında tut — component sadece **"bu fonksiyonu çağır"** der:

```ts
// services/post.service.ts
import { api } from './api';

export type Post = { id: number; title: string; body: string; userId: number };

export const postService = {
  list:   ()           => api.get<Post[]>('/posts'),
  show:   (id: number) => api.get<Post>(`/posts/${id}`),
  create: (data: Omit<Post, 'id'>) => api.post<Post>('/posts', data),
  remove: (id: number) => api.delete<void>(`/posts/${id}`),
};
```

### Component'ta Kullanım

```tsx
import { useEffect, useState } from 'react';
import { postService, type Post } from '@/services/post.service';

function PostList() {
  const [posts,   setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    postService.list()
      .then(data => { if (!cancelled) setPosts(data); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  if (loading)         return <Spinner />;
  if (error)           return <p className="text-red-600">{error}</p>;
  if (!posts.length)   return <p>Post yok</p>;

  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

### Env Variables (`.env`)

```bash
# .env
VITE_API_URL=https://jsonplaceholder.typicode.com
```

```ts
// vite-env.d.ts — TS intellisense için
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
```

> **Kritik:** Vite'ta env değişkenleri **`VITE_` prefix'i** olmak zorunda. Prefix yoksa `import.meta.env`'te görünmez. **Asla secret** (API key, DB pass) koyma — bu dosya bundle'a girer ve client'a iner.

### 🎥 Videolar

- [Fetch API Tutorial — Net Ninja](https://www.youtube.com/watch?v=Oive66jrwBs)
- [React API Calls — Dave Gray](https://www.youtube.com/watch?v=00lxm_doFYw)

### 📚 Ek Okuma

- [MDN — Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Vite — Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- [JSONPlaceholder — free fake REST API](https://jsonplaceholder.typicode.com/)

### 🧪 Görev

1. `services/api.ts` wrapper'ını kur.
2. `services/post.service.ts` yaz — `list`, `show` metotları.
3. `PostsPage`'de service'i kullan, loading/error/empty state göster.
4. `.env` ile `VITE_API_URL` tanımla, `api.ts`'te kullan.
5. Sayfa'ya "Yeni Post Ekle" formu koy → `postService.create`'i çağır, sonuç console'a (JSONPlaceholder gerçekten yazmaz, 201 döner).

---

## 🧠 8. Zustand (Global State)

### Neden Zustand?

- **Minimal API** — boilerplate'siz store
- **Hook-based** — `useStore()` direkt component'tan çağrılır, `Provider` gerekmez
- **Middleware** — `persist` (localStorage), `devtools` (Redux DevTools), `immer` (mutable syntax)
- **Performant** — selector ile gereksiz re-render yok
- **TS desteği** — tip güvenli

### Kurulum

```bash
yarn add zustand
```

### Basit Counter Store

```ts
// store/counter.store.ts
import { create } from 'zustand';

type CounterState = {
  count:     number;
  increment: () => void;
  decrement: () => void;
  reset:     () => void;
};

export const useCounterStore = create<CounterState>((set) => ({
  count:     0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset:     () => set({ count: 0 }),
}));
```

```tsx
// Component — Provider yok, direkt kullan
function Counter() {
  const count     = useCounterStore(s => s.count);
  const increment = useCounterStore(s => s.increment);

  return <button onClick={increment}>+{count}</button>;
}
```

> **Selector pattern:** `useCounterStore(s => s.count)` — sadece `count` değişince re-render olur. Tüm store'u çekersen (`useCounterStore()`) **her değişiklikte** re-render olursun.

### Todo Store (Domain State Örneği)

```ts
// store/todo.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Todo = { id: string; title: string; done: boolean };

type TodoState = {
  todos:      Todo[];
  add:        (title: string) => void;
  toggle:     (id: string) => void;
  remove:     (id: string) => void;
  clearDone:  () => void;
  remaining:  () => number;
};

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],

      add: (title) => set(state => ({
        todos: [...state.todos, { id: crypto.randomUUID(), title, done: false }],
      })),

      toggle: (id) => set(state => ({
        todos: state.todos.map(t => t.id === id ? { ...t, done: !t.done } : t),
      })),

      remove: (id) => set(state => ({
        todos: state.todos.filter(t => t.id !== id),
      })),

      clearDone: () => set(state => ({
        todos: state.todos.filter(t => !t.done),
      })),

      remaining: () => get().todos.filter(t => !t.done).length,
    }),
    { name: 'todo-storage' },                      // localStorage key
  ),
);
```

```tsx
function TodoApp() {
  const todos     = useTodoStore(s => s.todos);
  const add       = useTodoStore(s => s.add);
  const toggle    = useTodoStore(s => s.toggle);
  const remaining = useTodoStore(s => s.remaining());

  const [input, setInput] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) { add(input); setInput(''); }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button>Ekle</button>
      </form>
      <p>Kalan: {remaining}</p>
      <ul>
        {todos.map(t => (
          <li key={t.id} onClick={() => toggle(t.id)}>
            {t.done ? <s>{t.title}</s> : t.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### UI Store (Toast, Modal, Sidebar)

```ts
// store/ui.store.ts
import { create } from 'zustand';

type Toast = { id: string; message: string; type: 'success' | 'error' };

type UIState = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

  toasts: [],
  addToast: (message, type = 'success') => {
    const id = crypto.randomUUID();
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}));
```

### DevTools Middleware

```ts
import { devtools } from 'zustand/middleware';

export const useTodoStore = create<TodoState>()(
  devtools(
    persist(
      (set, get) => ({ /* ... */ }),
      { name: 'todo-storage' },
    ),
    { name: 'todo-store' },
  ),
);
```

Chrome'da **Redux DevTools** eklentisiyle state history + action log göreceksin.

### 🎥 Videolar

- [Zustand in 10 minutes — Jack Herrington](https://www.youtube.com/watch?v=_ngCLZ5Iz-0)
- [Zustand Complete Guide — Cosden Solutions](https://www.youtube.com/watch?v=sqTPGMipjHk)

### 📚 Ek Okuma

- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Zustand Docs](https://zustand.docs.pmnd.rs/)

### 🧪 Görev

1. `todo.store.ts` yaz — `add / toggle / remove / clearDone / remaining`.
2. `persist` middleware ile `localStorage`'a yaz, sayfa yenilenince todolar kalsın.
3. `ui.store.ts`'te `toast` sistemi kur — todo eklenince `addToast('Eklendi')` çağır.
4. `<Toast />` component'ını tasarla, store'u dinleyip render etsin.
5. `devtools` middleware'i ekle, Redux DevTools'ta action'ları gör.

---

## 🔑 9. Session Management (Zustand ile)

Session = "kullanıcı kim ve oturumu ne kadar sürüyor". Backend olmadığında bile **akışı** doğru kurmalıyız; backend geldiğinde aynı pattern çalışır, sadece `login/logout/me` fonksiyonları gerçek API'ye bağlanır.

### Session Store

```ts
// store/session.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id:    string;
  name:  string;
  email: string;
};

type SessionState = {
  user:      User | null;
  token:     string | null;
  hydrated:  boolean;                      // persist'ten state yüklendi mi?

  login:     (user: User, token: string) => void;
  logout:    () => void;
  setUser:   (user: User) => void;

  isLoggedIn: () => boolean;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      user:     null,
      token:    null,
      hydrated: false,

      login:   (user, token) => set({ user, token }),
      logout:  ()            => set({ user: null, token: null }),
      setUser: (user)        => set({ user }),

      isLoggedIn: () => get().user !== null,
    }),
    {
      name: 'session-storage',
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;   // persist tamamlanınca işaretle
      },
    },
  ),
);
```

### Login Akışı

Backend yoksa login'i **mock** et:

```ts
// services/auth.service.ts
import { api } from './api';
import type { User } from '@/store/session.store';

type LoginResponse = { user: User; token: string };

export const authService = {
  // Gerçek API: return api.post<LoginResponse>('/auth/login', creds);
  async login(creds: { email: string; password: string }): Promise<LoginResponse> {
    // Mock — backend gelince burayı değiştir
    await new Promise(r => setTimeout(r, 500));          // fake latency
    if (creds.email !== 'demo@local' || creds.password !== 'demo1234') {
      throw new Error('E-posta veya şifre hatalı');
    }
    return {
      user:  { id: '1', name: 'Demo Kullanıcı', email: creds.email },
      token: 'fake-jwt-token',
    };
  },

  async logout() {
    // Gerçek API: await api.post('/auth/logout');
    await new Promise(r => setTimeout(r, 200));
  },
};
```

### Login Page

```tsx
// pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService }    from '@/services/auth.service';
import { useSessionStore } from '@/store/session.store';
import { useUIStore }      from '@/store/ui.store';

export default function LoginPage() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const login     = useSessionStore(s => s.login);
  const addToast  = useUIStore(s => s.addToast);
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = (location.state as any)?.from?.pathname ?? '/';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { user, token } = await authService.login(form);
      login(user, token);
      addToast(`Hoş geldin ${user.name}`, 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto p-4 space-y-3">
      <input
        type="email" placeholder="E-posta"
        value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
      />
      <input
        type="password" placeholder="Şifre"
        value={form.password}
        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
      />
      <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
        {loading ? 'Giriş yapılıyor...' : 'Giriş'}
      </button>
    </form>
  );
}
```

### Logout + Navbar Entegrasyonu

```tsx
// components/layout/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useSessionStore } from '@/store/session.store';
import { authService }     from '@/services/auth.service';

export function Navbar() {
  const user     = useSessionStore(s => s.user);
  const logoutFn = useSessionStore(s => s.logout);
  const navigate = useNavigate();

  async function handleLogout() {
    await authService.logout();
    logoutFn();
    navigate('/login');
  }

  return (
    <nav className="flex justify-between p-4 border-b">
      <Link to="/">Home</Link>
      {user ? (
        <div className="flex gap-3">
          <span>Merhaba, {user.name}</span>
          <button onClick={handleLogout}>Çıkış</button>
        </div>
      ) : (
        <Link to="/login">Giriş</Link>
      )}
    </nav>
  );
}
```

### `ProtectedRoute` + `hydrated` Kontrolü

`persist` middleware `localStorage`'tan state'i **async** yükler. Yükleme tamamlanmadan `user === null` göreceksin — ve kullanıcıyı yanlışlıkla `/login`'e atacaksın. `hydrated` flag'i bu yüzden var.

```tsx
// routes/ProtectedRoute.tsx
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSessionStore } from '@/store/session.store';

export function ProtectedRoute() {
  const user     = useSessionStore(s => s.user);
  const hydrated = useSessionStore(s => s.hydrated);
  const location = useLocation();

  if (!hydrated) return <p>Yükleniyor...</p>;
  if (!user)     return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
}
```

### Backend Gelince Ne Değişir?

Sadece **3 nokta:**

1. `authService.login/logout` — mock yerine gerçek API çağrısı
2. `api.ts` — `Authorization: Bearer ${token}` header'ı (session store'dan token çek)
3. `api.ts` — 401 alınca session'ı temizleyip `/login`'e atma

```ts
// services/api.ts — 401 handling örneği
import { useSessionStore } from '@/store/session.store';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useSessionStore.getState().token;     // component dışında store erişimi

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (res.status === 401) {
    useSessionStore.getState().logout();
    window.location.href = '/login';
    throw new Error('Yetki yok');
  }

  // ... (önceki error handling aynı)
}
```

> **Kritik:** `useSessionStore.getState()` hook'un **component dışında** çağrılan versiyonu. `services/api.ts` gibi hook olmayan yerlerde bunu kullan.

### 🎥 Videolar

- [Zustand Authentication — Cosden](https://www.youtube.com/watch?v=lvKTzvaeXZM)
- [Protected Routes Pattern](https://www.youtube.com/watch?v=2k8NleFjG7I)

### 📚 Ek Okuma

- [Zustand — Persist Middleware](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)
- [React Router — Auth Example](https://github.com/remix-run/react-router/tree/main/examples/auth)

### 🧪 Görev

1. `session.store.ts` yaz — `user`, `token`, `hydrated`, `login/logout/setUser`.
2. `persist` middleware ile localStorage'a yaz.
3. `authService.login` mock'unu yaz, `demo@local` / `demo1234` ile başarılı olsun.
4. `LoginPage` + `<ProtectedRoute />` + Navbar'da user badge kur.
5. Sayfa yenile — login hâlâ duruyor mu? `hydrated` olmadan redirect olmuyor mu? Test et.

---

## 🧱 10. Production Yapı

Tek `App.tsx`'te çalışmıyoruz. Bakımı kolay, genişleyebilir bir yapıya geçiyoruz.

### Önerilen Klasör Yapısı

```
/src
├── main.tsx                        ← Entry (Router + providers)
├── App.tsx                         ← Route tanımları
│
├── components/
│   ├── ui/                         ← Button, Input, Card, Modal, Toast, Spinner
│   ├── layout/                     ← Navbar, Footer, Sidebar, PageHeader
│   └── <domain>/                   ← TodoItem, PostCard, UserBadge
│
├── pages/                          ← Route başına 1 dosya
│   ├── HomePage.tsx
│   ├── PostsPage.tsx
│   ├── LoginPage.tsx
│   └── ProfilePage.tsx
│
├── hooks/                          ← useDebounce, useFetch, useClickOutside
│
├── services/                       ← API katmanı
│   ├── api.ts
│   ├── auth.service.ts
│   └── post.service.ts
│
├── store/                          ← Global state (Zustand)
│   ├── ui.store.ts
│   ├── todo.store.ts
│   └── session.store.ts
│
├── types/                          ← Interface / type (API response'lar dahil)
│   ├── api.ts
│   └── user.ts
│
├── utils/                          ← formatDate, cn (classNames), validators
└── routes/
    ├── index.tsx                   ← <Routes>
    └── ProtectedRoute.tsx
```

### Component Hiyerarşisi — Dumb vs Smart

- **`components/ui/*`** — state **yok**, props alır, JSX döner. Yeniden kullanılabilir.
- **`components/<domain>/*`** — domain bilir (`Todo`, `Post`), hâlâ props alır.
- **`pages/*`** — sayfaya özel, **store + service** kullanır, route tarafından render edilir.

> **Kural:** `ui/` içindeki bir component, fetch çağrısı **yapmaz**, store'a **bağlanmaz**. Projeye özel değildir.

### Path Alias

`vite.config.ts`'te kurduğun `@/`'yı her yerde kullan:

```ts
import { Button }       from '@/components/ui/Button';
import { postService }  from '@/services/post.service';
import { useSessionStore } from '@/store/session.store';
import type { User }    from '@/types/user';
```

### Error Boundary — Global Hata Kalkanı

```tsx
// components/ErrorBoundary.tsx
import React from 'react';

type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(e: Error): State {
    return { hasError: true, message: e.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('UI crash:', error, info);
    // Production'da Sentry / LogRocket / kendi log endpoint'ine gönder
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h1>Bir şeyler ters gitti.</h1>
          <button onClick={() => location.reload()}>Sayfayı yenile</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// main.tsx
<ErrorBoundary>
  <BrowserRouter><App /></BrowserRouter>
</ErrorBoundary>
```

### Form Handling — Controlled Component Pattern

```tsx
function SignupForm() {
  const [form,   setForm]   = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.email.includes('@'))          errs.email    = 'Geçersiz e-posta';
    if (form.password.length < 6)           errs.password = 'Min 6 karakter';
    if (Object.keys(errs).length) return setErrors(errs);

    setErrors({});
    // ...submit
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="email"    value={form.email}    onChange={onChange} />
      {errors.email && <p className="text-red-600">{errors.email}</p>}
      <input name="password" value={form.password} onChange={onChange} type="password" />
      {errors.password && <p className="text-red-600">{errors.password}</p>}
      <button>Kaydol</button>
    </form>
  );
}
```

> **Mid → Senior'a geçişte:** Form büyüyünce [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/). Öncelik: önce elle yaz, sonra ihtiyaç duyunca kütüphaneye geç.

### 📚 Ek Okuma

- [Bulletproof React — feature-based architecture](https://github.com/alan2207/bulletproof-react)
- [React Folder Structure — robinwieruch](https://www.robinwieruch.de/react-folder-structure/)

---

## 🚀 11. Performance & Best Practices

### `React.memo` — Gereksiz Render'ı Kes

Parent re-render olduğunda, props değişmediyse child'ı yeniden render **etme**:

```tsx
import { memo } from 'react';

type Props = { title: string; done: boolean };

function TodoItem({ title, done }: Props) {
  console.log('render:', title);
  return <li>{done ? <s>{title}</s> : title}</li>;
}

export default memo(TodoItem);          // props shallow eşitse render yok
```

**Dikkat:** Inline fonksiyon / object prop geçiyorsan her render'da yeni referans olur, `memo` işe yaramaz:

```tsx
// YANLIŞ
<TodoItem style={{ color: 'red' }} />   // {style} her render'da yeni objet

// DOĞRU
const style = useMemo(() => ({ color: 'red' }), []);
<TodoItem style={style} />
```

### Key Stability

```tsx
{/* YANLIŞ — index değişince React yanlış yerlere eşleme yapar */}
{items.map((it, i) => <Item key={i} {...it} />)}

{/* DOĞRU — stabil id */}
{items.map(it => <Item key={it.id} {...it} />)}
```

### Liste Virtualization

1000+ satır göstermek için DOM'da hepsini tutma. `@tanstack/react-virtual`:

```bash
yarn add @tanstack/react-virtual
```

### Lazy Loading

```tsx
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>
```

Chrome Network tab'de ayrı `.js` chunk'ı görürsün. İlk sayfa yüklemesi hafifler.

### Image Optimization

- `<img loading="lazy">` — viewport dışı resim geç yüklensin
- `srcset` / `sizes` — ekran boyutuna göre resim seç
- WebP / AVIF format
- Placeholder (blur / skeleton)

### Best Practices — Check-list

1. **Component'i küçük tut** — 200 satırı geçerse parçala
2. **State'i kullanıldığı yere yakın tut** — tüm state global değildir
3. **Props drilling 3 seviye geçerse** → Context / Zustand
4. **API logic'i component'ta yazma** → `services/` altına taşı
5. **Magic string kullanma** — route path'leri, storage key'leri, API endpoint'leri sabitte tut
6. **`useEffect`'i en az kullan** — event handler'da yapılabileni effect'e atma
7. **Error state'i unutma** — `loading / data / error / empty` dört durumu kapsa
8. **Memoization kararlı** — ölçmeden `memo`/`useMemo` serpme
9. **Form validation iki tarafta** — client UX, server güvenlik
10. **Accessibility** — `<button>` vs `<div onClick>`, semantic tag, aria label

### 📚 Ek Okuma

- [React Docs — Optimizing Performance](https://react.dev/reference/react/memo)
- [Web Vitals (Google)](https://web.dev/vitals/)
- [Patterns.dev](https://www.patterns.dev/)

---

## 🛡️ 12. Frontend Security

Frontend'de güvenlik, bilinen yanılgıları önlemekle başlar: **Client'a veri iner, client'a güven yoktur.**

### Altın Kurallar

1. **`.env`'de hassas veri yok** — Vite'taki `VITE_*` dahil her şey bundle'a girer ve client'a iner. API secret, DB pass burada **olmaz**, backend'de kalır.
2. **XSS savunması** — `dangerouslyInnerHTML` kullanma. React zaten string'leri escape eder, ama `dangerouslyInnerHTML` bypass'tır.
3. **HTTPS zorunlu** — production'da `http://` kullanma.
4. **Auth check backend'de kesin** — frontend redirect UX için, yetki güvenliği backend'de. `localStorage`'da "isAdmin: true" tutmak güvenlik değildir.
5. **Dependency audit** — `yarn audit` düzenli. Bulaşmış paketler için [Snyk](https://snyk.io/) / [Socket](https://socket.dev/).
6. **Error mesajını ham göstermeme** — error boundary'de "Sunucu hatası" genel mesajı, stack trace'i console/log'a.

### XSS Örneği — React Nasıl Koruyor?

```tsx
const input = '<script>alert(1)</script>';

// GÜVENLİ — React otomatik escape eder, ekranda literal string görünür
<div>{input}</div>

// TEHLİKELİ — HTML olarak yorumlanır, script çalışır
<div dangerouslySetInnerHTML={{ __html: input }} />
```

**Kullanıcıdan gelen HTML'i render etmek zorundaysan** (örn. blog post body), önce `DOMPurify` ile temizle:

```bash
yarn add dompurify
yarn add -D @types/dompurify
```

```tsx
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

### Token Nerede Tutulur?

- **`localStorage`** — JS'ten okunur → **XSS'e savunmasız**
- **HttpOnly cookie** — JS'ten okunamaz → XSS'ten etkilenmez, backend tarafı set eder
- **`sessionStorage`** — sekme kapatılınca biter, `localStorage` ile aynı XSS riski
- **Memory (Zustand state)** — sayfa yenileyince kaybolur (persist ile yine localStorage)

> **Pratik:** Bu rehberde Zustand + persist (localStorage) kullanıyoruz çünkü **eğitim senaryosunda** yeterli. Gerçek production'da **HttpOnly cookie** (backend set eder) çok daha güvenli — JS token'a dokunmaz.

### 📚 Ek Okuma

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Snyk — React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)

### 🧪 Görev

Yazdığın projeyi şu check-list ile denetle:

- [ ] `.env`'de `VITE_*` olarak hassas veri var mı? (Olmamalı)
- [ ] `dangerouslyInnerHTML` kullanıyor musun? Neden?
- [ ] API wrapper'da 401 → redirect, error boundary sarmalıyor mu?
- [ ] HTTPS'e deploy edildi mi?
- [ ] `yarn audit` temiz mi?

---

## 🚀 13. Final Project

### Proje: Kişisel Görev & Not Dashboard'u

Kendi başına tasarlayıp teslim edeceğin, bu rehberde öğrendiklerinin tümünü birleştiren orta ölçekli bir SPA.

### Özellikler

**Auth (public → private geçiş):**
- `/login` — mock login (ilk aşamada), backend olunca gerçek API
- `/register` — mock register
- Session persist — sayfa yenileyince kalıcı

**Private (auth gerekir):**
- `/` — Dashboard ana: karşılama + istatistik (toplam todo, kalan, favorite post sayısı)
- `/todos` — Todo listesi (Zustand + persist) + filtre (hepsi/aktif/bitti) + arama
- `/posts` — JSONPlaceholder'dan post listesi + arama + pagination
- `/posts/:id` — Post detay + yorumları çek
- `/profile` — Kullanıcı adı / email düzenle (session store'u güncelle)
- `/settings` — Tema (light/dark) + dil toggle

### Minimum Teslim Gereksinimleri

- [x] Vite + TypeScript + Tailwind kurulu
- [x] React Router — nested layout, `ProtectedRoute`
- [x] `api.ts` wrapper — error handling + token header
- [x] **Zustand** — `ui.store`, `todo.store`, `session.store` (persist + hydrated flag)
- [x] `.env` ile `VITE_API_URL`
- [x] `components/ui/*` — Button, Input, Card, Spinner, Toast, Modal
- [x] `hooks/*` — `useDebounce`, `useFetch`
- [x] Form validation (elle yazılmış, client tarafı)
- [x] Loading / error / empty state her listede
- [x] Responsive (mobile-first) + dark mode toggle
- [x] `React.lazy` + `Suspense` — en az 1 sayfa lazy
- [x] Error boundary — root'ta
- [x] README — kurulum + özellik listesi + ekran görüntüsü
- [x] Git — feature branch + anlamlı commit message

### Bonus

- [ ] `react-hook-form` + `zod` validation
- [ ] Optimistic update (todo toggle'da önce UI, sonra "sync")
- [ ] Skeleton loader
- [ ] i18n (`react-i18next`) — TR/EN toggle
- [ ] Vercel / Netlify'a deploy — public URL
- [ ] Lighthouse score 90+

---

## 📈 Sonraki Adım: Redux Toolkit

Bu rehber bitince Zustand ile orta ölçekte her şeyi yapabilirsin. Ama bazı durumlarda **Redux Toolkit** hâlâ değerli:

- **Büyük ekip** — `slice` pattern ekibin kodunu modüler tutar
- **Zengin DevTools** — action log + time travel debugging Zustand'ınkinden derin
- **Complex async** — `createAsyncThunk` + `RTK Query` data fetching + cache
- **Iş ilanları** — TR'de hâlâ çok ilanda Redux geçer

**Ne zaman geçiş?**
- Zustand store'ların 5–10'a ulaştığında ve birbirleriyle zincirleme bağlı olmaya başladığında
- Ekip 3+ kişiye çıktığında
- `RTK Query`'nin cache/invalidation ihtiyacın belirginleştiğinde

**Kaynak:**
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Redux Essentials Tutorial](https://redux.js.org/tutorials/essentials/part-1-overview-concepts)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

> Bu rehberin kapsamı dışı — **final project'i Zustand ile bitirdikten sonra** bakmaya değer.

---

## 🔥 Gelişim Modeli

### Günlük

- **1 konu** oku / video izle
- **1 görev** tamamla (doküman içindeki görevler)

### Haftalık

- **1 mini proje** teslim et
- Yazdığını **ertesi gün yeniden oku** — "bugün yazsam nasıl yazardım?" sor

### Aylık

- Geçen ay yazdığın component'ı aç, **refactor et.**
- Yeni bir konu ekle (test, animation, a11y, CI/CD)
- Final project'i **deploy** et ve paylaş (GitHub, portföy)

---

## 📖 Ek Kaynaklar

### Resmi Dokümantasyon

- [React Docs (react.dev)](https://react.dev/) — tek ve nihai React referansı
- [Vite Guide](https://vitejs.dev/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Router](https://reactrouter.com/)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/) — HTML, CSS, JS, HTTP

### Öğrenme Siteleri

- [javascript.info](https://javascript.info/) — ES6+ tam referans
- [Patterns.dev](https://www.patterns.dev/) — React + design patterns
- [web.dev](https://web.dev/) — performance + vitals

### Video Kanalları (Doğrulanmış)

- [Traversy Media](https://www.youtube.com/@TraversyMedia)
- [Web Dev Simplified](https://www.youtube.com/@WebDevSimplified)
- [Jack Herrington](https://www.youtube.com/@jherr)
- [Cosden Solutions](https://www.youtube.com/@cosdensolutions)
- [Fireship](https://www.youtube.com/@Fireship)
- [The Net Ninja](https://www.youtube.com/@NetNinja)
- [Dave Gray](https://www.youtube.com/@DaveGrayTeachesCode)

### Güvenlik

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Snyk Blog](https://snyk.io/blog/)

### Araçlar

- [React DevTools](https://react.dev/learn/react-developer-tools) — Chrome eklentisi
- [Redux DevTools](https://github.com/reduxjs/redux-devtools) — Zustand `devtools` middleware'i buraya bağlanır
- [Bundlephobia](https://bundlephobia.com/) — paket boyutu check
- [Can I Use](https://caniuse.com/) — browser support check

### İlham / Referans Projeler

- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- [shadcn/ui](https://ui.shadcn.com/) — copy-paste Tailwind component'leri
- [TanStack](https://tanstack.com/) — Query, Router (sonraki adımlar için)

---

## 🧠 Son Not

Bu doküman **okumak için** değil, **yazarak ilerlemek için** hazırlanmıştır.
Her bölümün sonundaki **görev tamamlanmadan** bir sonraki bölüme geçmek seni junior seviyede tutar.
Kod yazmadan okuduğun her şey, yazmadığın anda unutulur.

Zustand'ı hazmetmeden Redux'a atlama **yasak**.
TypeScript'e hazır olmadan prod kodda JS yazma **yasak** — proje ne küçük olursa olsun.

Bir şey takılırsa önce:
1. Browser console + Vite terminal output'u oku
2. TS hatası **copy-paste** olarak ara (Stack Overflow, GitHub issues)
3. Resmi dokümana bak (`react.dev`, MDN)
4. Minimal reproduction üret — sorunu izole et
5. Sonra sor

**Sor ama önce aç.**

Made by devilyxrd XD
