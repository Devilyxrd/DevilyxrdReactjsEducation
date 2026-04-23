import type { Category, Product } from '@/features/products/types';

/**
 * Mock ürün katalogu.
 *
 * Gerçek projede `services/product.service.ts` üzerinden API'den çekilir.
 * Burada eğitim amaçlı statik array + setTimeout ile fake latency simüle
 * ediyoruz (bkz. `fetchProducts` fonksiyonu).
 *
 * Görsel yerine emoji kullanıyoruz — CDN/asset yönetimiyle uğraşmadan
 * görsel hissi vermek için.
 */

export const categories: { value: Category; label: string; emoji: string }[] = [
  { value: 'elektronik', label: 'Elektronik', emoji: '📱' },
  { value: 'giyim',      label: 'Giyim',      emoji: '👕' },
  { value: 'ev',         label: 'Ev',         emoji: '🏠' },
  { value: 'spor',       label: 'Spor',       emoji: '⚽' },
  { value: 'kitap',      label: 'Kitap',      emoji: '📚' },
];

export const mockProducts: Product[] = [
  { id: 1,  name: 'Kablosuz Kulaklık',    description: 'Aktif gürültü engelleme, 30 saat pil.', price: 1299,  category: 'elektronik', featured: true,  stock: 24, rating: 4.6, image: '🎧' },
  { id: 2,  name: 'Mekanik Klavye',        description: 'RGB aydınlatma, kahverengi switch.',     price: 2499,  category: 'elektronik', featured: true,  stock: 12, rating: 4.8, image: '⌨️' },
  { id: 3,  name: 'Oyuncu Mouse',          description: 'Hafif, 16000 DPI, programlanabilir.',     price: 799,   category: 'elektronik',                  stock: 35, rating: 4.4, image: '🖱️' },
  { id: 4,  name: 'Akıllı Saat',           description: 'Nabız, SpO2, GPS, 7 gün pil.',            price: 3299,  category: 'elektronik', featured: true,  stock: 8,  rating: 4.5, image: '⌚' },

  { id: 5,  name: 'Oversize Tişört',        description: '%100 pamuk, siyah, unisex.',             price: 299,   category: 'giyim',                       stock: 50, rating: 4.2, image: '👕' },
  { id: 6,  name: 'Kapüşonlu Sweatshirt',   description: 'Kalın kumaş, içi polar.',                price: 649,   category: 'giyim',      featured: true,  stock: 30, rating: 4.7, image: '🧥' },
  { id: 7,  name: 'Slim Fit Kot Pantolon',  description: 'Streç dokuma, standart kesim.',          price: 799,   category: 'giyim',                       stock: 22, rating: 4.3, image: '👖' },
  { id: 8,  name: 'Sneaker',                description: 'Hafif, nefes alır kumaş tabanlık.',      price: 1199,  category: 'giyim',                       stock: 15, rating: 4.5, image: '👟' },

  { id: 9,  name: 'Aromatik Mum',            description: 'Lavanta + vanilya, 60 saat.',           price: 149,   category: 'ev',                          stock: 80, rating: 4.4, image: '🕯️' },
  { id: 10, name: 'Nordik Battaniye',        description: 'Yumuşak polyester, 150x200 cm.',        price: 549,   category: 'ev',         featured: true,  stock: 20, rating: 4.6, image: '🛋️' },
  { id: 11, name: 'Espresso Fincanı',        description: 'Porselen, 6\'lı set, 80 ml.',           price: 229,   category: 'ev',                          stock: 40, rating: 4.3, image: '☕' },

  { id: 12, name: 'Yoga Matı',               description: '6mm kalınlık, kaymaz yüzey.',           price: 349,   category: 'spor',                        stock: 28, rating: 4.5, image: '🧘' },
  { id: 13, name: 'Halter Seti',             description: '20 kg, ayarlanabilir ağırlık.',         price: 1499,  category: 'spor',                        stock: 7,  rating: 4.7, image: '🏋️' },
  { id: 14, name: 'Koşu Ayakkabısı',          description: 'Amortisörlü, uzun mesafe.',             price: 1899,  category: 'spor',       featured: true,  stock: 10, rating: 4.6, image: '👟' },

  { id: 15, name: 'Clean Code',               description: 'Robert C. Martin, yazılım klasiği.',    price: 229,   category: 'kitap',                       stock: 18, rating: 4.8, image: '📕' },
  { id: 16, name: 'Refactoring',              description: 'Martin Fowler, 2. baskı.',              price: 329,   category: 'kitap',                       stock: 11, rating: 4.9, image: '📘' },
  { id: 17, name: 'The Pragmatic Programmer', description: 'Klasik yazılım rehberi.',              price: 289,   category: 'kitap',       featured: true,  stock: 15, rating: 4.8, image: '📗' },
];

/**
 * Asenkron gibi davranan mock fetch — component'larda useEffect + loading
 * state pattern'ini test etmek için gerçek latency taklidi.
 */
export function fetchProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProducts), 400);
  });
}

export function fetchFeaturedProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProducts.filter((p) => p.featured)), 300);
  });
}
