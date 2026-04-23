export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;                     // Bu mock'ta emoji string; gerçek projede URL
  category: Category;
  featured?: boolean;
  stock: number;
  rating: number;                    // 0-5 arası
};

export type Category =
  | 'elektronik'
  | 'giyim'
  | 'ev'
  | 'spor'
  | 'kitap';
