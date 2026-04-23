import { useEffect, useState } from 'react';

/**
 * useDebounce — Bir değeri `delay` ms geciktirerek döndürür.
 *
 * Kullanım tipik olarak arama input'larında:
 *
 *   const [query, setQuery]       = useState('');
 *   const debounced               = useDebounce(query, 300);
 *   useEffect(() => { fetchProducts(debounced); }, [debounced]);
 *
 * Kullanıcı tuşa bastıkça `query` değişir ama `debounced` sadece
 * 300 ms boyunca ek tuş basılmazsa güncellenir. Bu sayede her
 * keystroke'ta API çağrısı yapılmaz.
 *
 * useEffect cleanup'ı burada kritik: eski `setTimeout` iptal edilmezse
 * her render'da yeni bir timer açılır, eskisi yine tetiklenir. cleanup
 * fonksiyonu effect her yeniden çalışmadan ÖNCE çağrılır.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
