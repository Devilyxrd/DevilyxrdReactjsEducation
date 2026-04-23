import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { authService } from '@/features/auth/services/auth.service';
import { useSessionStore } from '@/features/auth/store/session.store';
import { useUIStore } from '@/shared/store/ui.store';

/**
 * LoginPage — e-posta + şifre girişi.
 *
 * Akış:
 *   1) Form submit → validate → authService.login (mock, 500ms gecikme)
 *   2) Başarılı: session.login(user, token) → toast → önce gelinen
 *      sayfaya (location.state.from) veya '/' adresine yönlendir.
 *   3) Başarısız: hata toast + input'lar dolu kalır.
 *
 * Pattern'ler:
 *   - useState'lerin "single object" deseni (form) vs ayrı state
 *     (loading, error) — karışık bilinçli: "birlikte değişenler" toparlanır,
 *     "bağımsız değişenler" ayrılır.
 *   - try/finally — loading state hata olsa bile false'a dönmeli.
 *   - `location.state.from` — protected route'tan gelen kullanıcı giriş
 *     yapınca eski sayfaya dönsün (UX iyileştirmesi).
 */

export default function LoginPage() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const login    = useSessionStore((s) => s.login);
  const addToast = useUIStore((s) => s.addToast);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user, token } = await authService.login(form);
      login(user, token);
      addToast(`Hoş geldin, ${user.name}`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Giriş yapılamadı';
      setError(message);
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Giriş Yap"
      description="Hesabınla giriş yap veya demo hesabı kullan."
      footer={
        <>
          Hesabın yok mu?{' '}
          <Link to="/register" className="font-medium text-brand-300 hover:text-brand-200">
            Kayıt ol
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-posta"
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          leftIcon={<Mail className="h-4 w-4" />}
          placeholder="demo@local"
          required
        />

        <Input
          label="Şifre"
          type="password"
          name="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          leftIcon={<Lock className="h-4 w-4" />}
          placeholder="demo1234"
          required
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs text-zinc-400 transition-colors hover:text-brand-300"
          >
            Şifremi unuttum
          </Link>
        </div>

        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300 animate-fade-in">
            {error}
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          leftIcon={<LogIn className="h-4 w-4" />}
        >
          Giriş Yap
        </Button>

        <div className="rounded-md border border-zinc-800 bg-zinc-900/70 p-3 text-xs text-zinc-400">
          <div className="font-semibold text-zinc-300">Demo hesap</div>
          <div className="mt-1 space-y-0.5 font-mono">
            <div>E-posta: demo@local</div>
            <div>Şifre:   demo1234</div>
          </div>
        </div>
      </form>
    </AuthCard>
  );
}
