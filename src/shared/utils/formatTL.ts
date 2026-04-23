/**
 * formatTL — Sayıyı Türk Lirası formatına çevirir.
 *
 *   formatTL(1234.5)  -> "₺1.234,50"
 *   formatTL(0)       -> "₺0,00"
 *
 * Intl.NumberFormat her zaman locale-aware çıktı verir; elle
 * string concat etmekten çok daha güvenli ve okunabilir.
 */
export function formatTL(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
