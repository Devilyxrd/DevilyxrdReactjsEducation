/**
 * Cart feature'a özgü tipler.
 * Product tipini ayrı tutuyoruz çünkü sepet, ürün detayının SNAPSHOT'ını
 * tutmalı — ürün fiyatı değişse bile sepetteki eski fiyat korunmalı.
 */

export type CartItem = {
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
};
