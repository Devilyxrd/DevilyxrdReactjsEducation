import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Session Store — kullanıcı oturumunun tek kaynağı.
 *
 * Backend yok, bu yüzden login/register/forgot akışı mock. Store sadece
 * "kim giriş yapmış, token ne" bilgisini tutar; yanında `hydrated` flag'i
 * var çünkü `persist` middleware'i localStorage'tan veriyi ASYNC yükler —
 * ilk render'da `user === null` görünür ve yanlışlıkla kullanıcıyı /login'e
 * atabiliriz. `hydrated` tamamlanana kadar ProtectedRoute bekler.
 *
 * Register işleminde "kullanıcı DB'sini" mock etmek için `registeredUsers`
 * alanını da tutuyoruz — gerçek projede bu backend'de olur, burada
 * localStorage'a yazılıyor ki kayıt ol → giriş yap akışı test edilebilsin.
 */

export type User = {
  id: string;
  name: string;
  email: string;
};

/** Mock kullanıcı kaydı — security question ile forgot flow için. */
export type RegisteredUser = User & {
  password: string;              // Normalde HASH! Burada eğitim için plain.
  securityQuestion: string;
  securityAnswer: string;        // Normalde hash! Burada eğitim için plain.
};

type SessionState = {
  user: User | null;
  token: string | null;
  hydrated: boolean;

  // Mock DB — register olunca buraya yazıyoruz, login bundan doğruluyor
  registeredUsers: RegisteredUser[];

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  registerUser: (record: RegisteredUser) => void;
  updateUser: (patch: Partial<User>) => void;
  resetPassword: (email: string, newPassword: string) => boolean;

  // Getters (fonksiyon şeklinde çünkü Zustand'da `get()` aracılığıyla
  // anlık okunması gerekiyor)
  isLoggedIn: () => boolean;
  findUserByEmail: (email: string) => RegisteredUser | undefined;
};

// Her uygulama açılışında seed ettiğimiz demo hesap — rehbere uygun
const DEMO_USER: RegisteredUser = {
  id: 'demo-1',
  name: 'Demo Kullanıcı',
  email: 'demo@local',
  password: 'demo1234',
  securityQuestion: 'İlk evcil hayvanımın adı?',
  securityAnswer: 'pamuk',
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      hydrated: false,
      registeredUsers: [DEMO_USER],

      login: (user, token) => set({ user, token }),

      logout: () => set({ user: null, token: null }),

      registerUser: (record) =>
        set((s) => ({ registeredUsers: [...s.registeredUsers, record] })),

      updateUser: (patch) =>
        set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),

      resetPassword: (email, newPassword) => {
        const users = get().registeredUsers;
        const idx = users.findIndex(
          (u) => u.email.toLowerCase() === email.toLowerCase(),
        );
        if (idx === -1) return false;
        const updated = [...users];
        updated[idx] = { ...updated[idx], password: newPassword };
        set({ registeredUsers: updated });
        return true;
      },

      isLoggedIn: () => get().user !== null,

      findUserByEmail: (email) =>
        get().registeredUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase(),
        ),
    }),
    {
      name: 'session-storage',
      // Seed kullanıcı her zaman olsun: persist'ten yüklenen kayıtlar
      // DEMO_USER içermiyorsa başa ekleniyor (merge pattern)
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const hasDemo = state.registeredUsers.some(
          (u) => u.email === DEMO_USER.email,
        );
        if (!hasDemo) {
          state.registeredUsers = [DEMO_USER, ...state.registeredUsers];
        }
        state.hydrated = true;
      },
    },
  ),
);
