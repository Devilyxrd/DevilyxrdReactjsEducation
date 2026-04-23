import { create } from 'zustand';

/**
 * UI Store — uygulamanın ihtiyaç duyduğu ephemeral UI state'i.
 *
 * Toast bildirimleri burada çünkü toast'u tetikleyen component ile gösteren
 * component (ToastContainer) farklı yerlerde. Prop drilling yerine global
 * store ile bağlıyoruz. Persist edilmiyor — sayfa yenilenince toast'lar gider.
 *
 * Toast pattern:
 *   1) herhangi bir component:  useUIStore.getState().addToast('Kaydedildi')
 *      (veya hook ile)        const addToast = useUIStore(s => s.addToast)
 *   2) ToastContainer store.toasts'ı dinler, her birini render eder
 *   3) addToast setTimeout ile 3 sn sonra kendisini remove eder
 */

export type ToastType = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type UIState = {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  toasts: [],

  addToast: (message, type = 'info') => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));

    // 3 saniye sonra otomatik kapat
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
