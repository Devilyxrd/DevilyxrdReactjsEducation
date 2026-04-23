import { useSessionStore, type RegisteredUser, type User } from '@/features/auth/store/session.store';

/**
 * Auth Service — gerçek backend olmadığı için mock.
 *
 * Her fonksiyon Promise döndürüyor (async). Backend geldiğinde SADECE
 * bu dosyanın içindekileri değiştirip `fetch('/api/auth/...')` yapman
 * yeterli olacak; component'ler tamamen aynı kalır.
 *
 * `await new Promise(r => setTimeout(r, 500))` — gerçek latency'yi taklit
 * ediyoruz ki loading state'i component'ta düzgün test edebilesin.
 */

type LoginPayload = { email: string; password: string };
type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  securityQuestion: string;
  securityAnswer: string;
};

type LoginResponse = { user: User; token: string };

const latency = () => new Promise<void>((r) => setTimeout(r, 500));

export const authService = {
  async login({ email, password }: LoginPayload): Promise<LoginResponse> {
    await latency();
    const found = useSessionStore.getState().findUserByEmail(email);
    if (!found || found.password !== password) {
      throw new Error('E-posta veya şifre hatalı');
    }
    const { password: _pw, securityAnswer: _sa, securityQuestion: _sq, ...publicUser } = found;
    return { user: publicUser, token: `mock-token-${found.id}` };
  },

  async register(payload: RegisterPayload): Promise<LoginResponse> {
    await latency();
    const store = useSessionStore.getState();
    if (store.findUserByEmail(payload.email)) {
      throw new Error('Bu e-posta zaten kayıtlı');
    }
    const record: RegisteredUser = {
      id: crypto.randomUUID(),
      name: payload.name,
      email: payload.email,
      password: payload.password,
      securityQuestion: payload.securityQuestion,
      securityAnswer: payload.securityAnswer.trim().toLowerCase(),
    };
    store.registerUser(record);
    const publicUser: User = { id: record.id, name: record.name, email: record.email };
    return { user: publicUser, token: `mock-token-${record.id}` };
  },

  /** Şifremi Unuttum — Adım 1: e-posta gönder, güvenlik sorusunu al */
  async forgotQuestion(email: string): Promise<{ question: string }> {
    await latency();
    const found = useSessionStore.getState().findUserByEmail(email);
    if (!found) throw new Error('Bu e-posta ile kayıt bulunamadı');
    return { question: found.securityQuestion };
  },

  /** Şifremi Unuttum — Adım 2: cevap + yeni şifre ile sıfırla */
  async forgotReset(
    email: string,
    answer: string,
    newPassword: string,
  ): Promise<void> {
    await latency();
    const found = useSessionStore.getState().findUserByEmail(email);
    if (!found) throw new Error('Bu e-posta ile kayıt bulunamadı');
    if (found.securityAnswer !== answer.trim().toLowerCase()) {
      throw new Error('Güvenlik cevabı yanlış');
    }
    useSessionStore.getState().resetPassword(email, newPassword);
  },

  async logout(): Promise<void> {
    await latency();
    // Gerçek API: await api.post('/auth/logout')
  },
};
