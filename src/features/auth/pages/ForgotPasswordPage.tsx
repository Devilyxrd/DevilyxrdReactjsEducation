import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, HelpCircle, Lock, CheckCircle2 } from 'lucide-react';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { authService } from '@/features/auth/services/auth.service';
import { useUIStore } from '@/shared/store/ui.store';

/**
 * ForgotPasswordPage — 2 adımlı şifre sıfırlama.
 *
 *   Adım 1 (step = 'email'):
 *     Kullanıcı e-posta girer → sistem kullanıcının güvenlik sorusunu
 *     döner. `step` state'i 'answer'a geçer.
 *
 *   Adım 2 (step = 'answer'):
 *     Kullanıcı cevap + yeni şifre girer → authService.forgotReset
 *     çağrılır → başarılıysa step 'done' olur → 2 saniye sonra login'e
 *     yönlendir (setTimeout + navigate).
 *
 * Pattern vurgusu:
 *   - useState<'email' | 'answer' | 'done'> — discriminated union ile
 *     "state machine" benzeri akış. TS burada çok yardımcı.
 *   - useState'ler sadeleştirilmedi, bilinçli ayrı tutuldu:
 *     email adımıyla answer adımı farklı veriler istiyor.
 */

type Step = 'email' | 'answer' | 'done';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const addToast = useUIStore((s) => s.addToast);
  const navigate = useNavigate();

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { question } = await authService.forgotQuestion(email);
      setQuestion(question);
      setStep('answer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalı');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotReset(email, answer, newPassword);
      setStep('done');
      addToast('Şifre başarıyla güncellendi', 'success');
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title={
        step === 'email' ? 'Şifremi Unuttum'
        : step === 'answer' ? 'Güvenlik Sorusu'
        : 'Şifre Güncellendi'
      }
      description={
        step === 'email' ? 'Hesabının e-postasını gir, sistem sana güvenlik sorunu sorsun.'
        : step === 'answer' ? 'Cevabı + yeni şifreni gir.'
        : 'Az sonra giriş sayfasına yönlendirileceksin.'
      }
      footer={
        step !== 'done' ? (
          <>
            Şifreni hatırladın mı?{' '}
            <Link to="/login" className="font-medium text-brand-300 hover:text-brand-200">
              Giriş yap
            </Link>
          </>
        ) : null
      }
    >
      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <Input
            label="E-posta"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4" />}
            placeholder="demo@local"
            required
          />
          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300 animate-fade-in">
              {error}
            </div>
          )}
          <Button type="submit" fullWidth size="lg" loading={loading}>
            Devam Et
          </Button>
        </form>
      )}

      {step === 'answer' && (
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <div className="rounded-md border border-zinc-800 bg-zinc-900/70 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Güvenlik sorunuz
            </p>
            <p className="mt-1 text-sm text-zinc-200">{question}</p>
          </div>

          <Input
            label="Cevap"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            leftIcon={<HelpCircle className="h-4 w-4" />}
            required
          />

          <Input
            label="Yeni Şifre"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            hint="En az 6 karakter"
            required
          />

          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300 animate-fade-in">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Şifreyi Güncelle
          </Button>
        </form>
      )}

      {step === 'done' && (
        <div className="flex flex-col items-center py-6 text-center animate-scale-in">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 ring-4 ring-emerald-500/20">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            Şifren güncellendi. Giriş sayfasına yönlendiriliyorsun...
          </p>
        </div>
      )}
    </AuthCard>
  );
}
