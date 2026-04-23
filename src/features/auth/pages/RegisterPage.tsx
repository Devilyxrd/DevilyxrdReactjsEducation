import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User2, HelpCircle, UserPlus } from 'lucide-react';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { authService } from '@/features/auth/services/auth.service';
import { useSessionStore } from '@/features/auth/store/session.store';
import { useUIStore } from '@/shared/store/ui.store';

/**
 * RegisterPage — yeni hesap oluşturma.
 *
 * Güvenlik sorusu + cevap alıyoruz çünkü Şifremi Unuttum akışı bunun
 * üzerinden çalışıyor. Gerçek projede e-posta doğrulaması + link ile
 * sıfırlama yapılır; burada eğitim senaryosu.
 *
 * Register başarılı → otomatik login → anasayfaya yönlendir. Backend
 * gerçekten varsa çoğu sistem register response'uyla birlikte token
 * döndürür; burada da aynı desen.
 */

type FormState = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  securityQuestion: string;
  securityAnswer: string;
};

const initialForm: FormState = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  securityQuestion: 'İlk evcil hayvanımın adı?',
  securityAnswer: '',
};

const questionOptions = [
  'İlk evcil hayvanımın adı?',
  'Doğduğum şehir?',
  'İlk okulumun adı?',
  'Annenizin kızlık soyadı?',
];

export default function RegisterPage() {
  const [form,    setForm]    = useState<FormState>(initialForm);
  const [errors,  setErrors]  = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);

  const login    = useSessionStore((s) => s.login);
  const addToast = useUIStore((s) => s.addToast);
  const navigate = useNavigate();

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: typeof errors = {};
    if (form.name.trim().length < 2)         errs.name            = 'Ad Soyad en az 2 karakter';
    if (!/^\S+@\S+\.\S+$/.test(form.email))   errs.email           = 'Geçerli bir e-posta girin';
    if (form.password.length < 6)            errs.password        = 'Şifre en az 6 karakter';
    if (form.password !== form.passwordConfirm) errs.passwordConfirm = 'Şifreler eşleşmiyor';
    if (form.securityAnswer.trim().length < 2) errs.securityAnswer = 'Cevap en az 2 karakter';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { user, token } = await authService.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        securityQuestion: form.securityQuestion,
        securityAnswer: form.securityAnswer,
      });
      login(user, token);
      addToast(`Kayıt başarılı! Hoş geldin, ${user.name}`, 'success');
      navigate('/', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kayıt başarısız';
      addToast(message, 'error');
      setErrors((e) => ({ ...e, email: message }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Hesap Oluştur"
      description="Kısa formu doldur, anında sisteme giriş yap."
      footer={
        <>
          Zaten bir hesabın var mı?{' '}
          <Link to="/login" className="font-medium text-brand-300 hover:text-brand-200">
            Giriş yap
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Ad Soyad"
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          error={errors.name}
          leftIcon={<User2 className="h-4 w-4" />}
          placeholder="Ahmet Yılmaz"
          autoComplete="name"
          required
        />
        <Input
          label="E-posta"
          type="email"
          value={form.email}
          onChange={(e) => setField('email', e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="h-4 w-4" />}
          placeholder="ornek@mail.com"
          autoComplete="email"
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Şifre"
            type="password"
            value={form.password}
            onChange={(e) => setField('password', e.target.value)}
            error={errors.password}
            leftIcon={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
            hint="En az 6 karakter"
            required
          />
          <Input
            label="Şifre (Tekrar)"
            type="password"
            value={form.passwordConfirm}
            onChange={(e) => setField('passwordConfirm', e.target.value)}
            error={errors.passwordConfirm}
            leftIcon={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
            required
          />
        </div>

        {/* Güvenlik sorusu seçimi */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Güvenlik Sorusu
          </label>
          <select
            value={form.securityQuestion}
            onChange={(e) => setField('securityQuestion', e.target.value)}
            className="w-full h-11 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-zinc-100 transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
          >
            {questionOptions.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>

        <Input
          label="Cevap"
          value={form.securityAnswer}
          onChange={(e) => setField('securityAnswer', e.target.value)}
          error={errors.securityAnswer}
          leftIcon={<HelpCircle className="h-4 w-4" />}
          placeholder="Cevabınız"
          hint="Şifre sıfırlama için gerekli olacak"
          required
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          Kayıt Ol
        </Button>
      </form>
    </AuthCard>
  );
}
