'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { saveAuth } from '@/lib/auth';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight } from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '', role: 'CLIENT',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', form);
      const { middlewareToken, userId, email, fullName, role } = res.data;
      saveAuth(middlewareToken, { userId, email, fullName, role });
      toast.success('Compte créé avec succès !');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center font-bold text-white text-xl">T</div>
            <span className="font-bold text-2xl"><span className="gradient-text">Talanty</span><span className="text-white/70">MG</span></span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Créer un compte</h1>
          <p className="text-white/50 mt-2">Rejoignez la communauté TalantyMG</p>
        </div>

        <div className="card p-8">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: 'CLIENT', label: '🛒 Je cherche des services' },
              { value: 'PROVIDER', label: '💼 Je propose mes services' },
            ].map(opt => (
              <button key={opt.value} type="button"
                onClick={() => setForm({ ...form, role: opt.value })}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  form.role === opt.value
                    ? 'border-primary-500 bg-primary-500/20 text-white'
                    : 'border-white/10 text-white/50 hover:border-white/30'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Nom complet</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input type="text" className="input-field pl-11" placeholder="Jean Rakoto"
                  value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input type="email" className="input-field pl-11" placeholder="votre@email.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Téléphone</label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input type="tel" className="input-field pl-11" placeholder="+261 34 ..."
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Mot de passe</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input type="password" className="input-field pl-11" placeholder="Minimum 6 caractères"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><span>Créer mon compte</span><FiArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/50">
            Déjà un compte ?{' '}
            <Link href="/auth/login" className="text-primary-400 hover:text-primary-300 font-medium">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
